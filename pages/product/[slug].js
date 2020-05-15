import { useState } from "react";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { compose } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { withApollo } from "../../lib/apollo";
import { withRedux } from "../../lib/redux";
import { useQuery } from "@apollo/react-hooks";
import DefaultLayout from "../../components/layout/default";
import Link from "../../lib/Link";

const PDP_QUERY = gql`
    query getProduct($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                id
                sku
                name
                sku
                stock_status
                description {
                    html
                }
                image {
                    url
                    label
                }
                price_range {
                    minimum_price {
                        regular_price {
                            currency
                            value
                        }
                        final_price {
                            currency
                            value
                        }
                    }
                }
            }
        }
    }
`;

const ProductPage = () => {
    const [qty, setQty] = useState(1);
    const items = useSelector((state) => state.items);
    const dispatch = useDispatch();
    const router = useRouter();

    const { loading, error, data } = useQuery(PDP_QUERY, {
        variables: { urlKey: router.query.slug },
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error</div>;
    }

    const product = data.products.items[0];

    console.log(product);

    const handleAddToCart = () => {
        let final_qty = typeof items[product.id] !== "undefined" ? items[product.id].qty : 0;
        let new_items = {
            ...items,
            [product.id]: {
                id: product.id,
                sku: product.sku,
                url_key: router.query.slug,
                name: product.name,
                image: product.image.url,
                qty: parseInt(qty) + parseInt(final_qty),
                price: product.price_range.minimum_price.final_price.value,
            },
        };

        dispatch({
            type: "CART_ADD",
            qty: qty,
            items: new_items,
        });
    };

    return (
        <DefaultLayout>
            <h1 className="page-title">{product.name}</h1>
            <img src={product.image.url} alt={product.image.label} style={{ border: "solid 1px #ccc" }} />
            <div dangerouslySetInnerHTML={{ __html: product.description.html }}></div>

            <div className="form-addtocart">
                <input type="number" min="0" value={qty} onChange={(e) => setQty(e.target.value)} />
                <button onClick={handleAddToCart}>Add To Cart</button>
            </div>

            <style jsx>{`
                header {
                    padding-top: 12px;
                    padding-bottom: 16px;
                }

                .product-item {
                    display: flex;
                    border: solid 1px #ddd;
                    border-radius: 8px;
                    margin-bottom: 12px;
                    padding: 16px;
                }

                .item-image img {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                }

                .item-information {
                    padding-left: 12px;
                }

                .item-information .item-link {
                    color: #454545;
                    font-weight: bold;
                    display: block;
                    margin-bottom: 12px;
                }

                .form-addtocart input {
                    width: 48px;
                }
            `}</style>
        </DefaultLayout>
    );
};

export default compose(withApollo, withRedux)(ProductPage);
