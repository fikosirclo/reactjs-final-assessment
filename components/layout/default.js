import { useState, useEffect } from "react";
import gql from "graphql-tag";
import Head from "next/head";
import { withApollo } from "../../lib/apollo";
import { withRedux } from "../../lib/redux";
import Link from "../../lib/Link";
import { compose } from "redux";
import { useSelector } from "react-redux";
import { useMutation } from "@apollo/react-hooks";
import Modal from "react-bootstrap/Modal";

const LOGIN_MUTATION = gql`
    mutation handleCustomerLogin($username: String!, $password: String!) {
        generateCustomerToken(email: $username, password: $password) {
            token
        }
    }
`;

const DefaultLayout = ({ children, enableCart }) => {
    const { items, qty } = useSelector((state) => state);
    const [showModal, setShowModal] = useState(false);
    const [email, setEmail] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [isLoggingIn, setLoggingIn] = useState(false);
    const [handleLoginHit, { loading, error }] = useMutation(LOGIN_MUTATION, {
        onCompleted({ generateCustomerToken }) {
            console.log(generateCustomerToken);
            localStorage.setItem("token", generateCustomerToken.token);
            localStorage.setItem("email", username);
            setUsername("");
            setPassword("");
            setLoggingIn(false);
            setShowModal(false);
        },
    });

    const handleLogin = (element) => {
        element.preventDefault();
        if (isLoggingIn) {
            return false;
        }
        setLoggingIn(true);
        handleLoginHit({ variables: { username: username, password: password } });
    };

    useEffect(() => {
        setEmail(localStorage.getItem("email") ? localStorage.getItem("email") : null);
    });

    let login_modal = (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Login</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4 p-md-5">
                <form onSubmit={(e) => handleLogin(e)}>
                    <div className="form-group">
                        <input
                            type="email"
                            className="form-control"
                            defaultValue={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Email Address"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-control"
                            defaultValue={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </div>
                    <button type="submit" className={`btn btn-primary w-100 mt-3${isLoggingIn ? " disabled" : ""}`}>
                        {isLoggingIn ? "Processing..." : "Submit"}
                    </button>
                </form>
            </Modal.Body>
        </Modal>
    );

    return (
        <>
            <header style={{ padding: "12px 0 20px" }}>
                <div className="main">
                    <div className="main-title">
                        <Link href="/">
                            <img src="/dist/images/swift-logo.png" alt="" />
                        </Link>
                    </div>
                    <div className="signin-menu">
                        {email ? `Welcome, ${email} ` : ""}
                        <Link href="/cart">Cart ({qty})</Link>
                        {email ? (
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("email");
                                    setEmail(null);
                                }}
                            >
                                Logout
                            </a>
                        ) : (
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowModal(true);
                                }}
                            >
                                Sign in
                            </a>
                        )}
                        {login_modal}
                    </div>
                </div>
            </header>

            <div className="main">
                <Head>
                    <link
                        href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap"
                        rel="stylesheet"
                    />
                </Head>

                <div className="main-content">{children}</div>

                <footer>&copy; 2020 Icube Team</footer>
            </div>
        </>
    );
};

export default compose(withApollo, withRedux)(DefaultLayout);
