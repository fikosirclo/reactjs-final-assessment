import gql from "graphql-tag";
import Head from "next/head";
import { withApollo } from "../../lib/apollo";
import Link from "../../lib/Link";
import { useSelector } from "react-redux";
import { useQuery } from "@apollo/react-hooks";

const DefaultLayout = ({ children, enableCart }) => {
    const { items, qty } = useSelector((state) => state);

    return (
        <>
            <header style={{ padding: "12px 0 20px" }}>
                <div className="main">
                    <div className="main-title">
                        <Link href="/">
                            <img src="/dist/images/swift-logo.png" alt="" />
                        </Link>
                    </div>
                    <div>
                        <Link href="/cart">Cart ({qty})</Link>
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

export default withApollo(DefaultLayout);
