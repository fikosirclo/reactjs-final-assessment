import gql from "graphql-tag";
import { compose } from "redux";
import { useSelector, useDispatch } from "react-redux";
import { withApollo } from "../lib/apollo";
import { withRedux } from "../lib/redux";
import { useQuery } from "@apollo/react-hooks";
import DefaultLayout from "../components/layout/default";
import Link from "../lib/Link";

const Cart = () => {
    const { items, qty } = useSelector((state) => state);
    const dispatch = useDispatch();
    let item_listing;
    let new_items;

    const handleUpdateQty = (e, prev_qty, next_qty) => {
        if (next_qty.trim() === "") {
            return false;
        }

        if (parseInt(next_qty) === 0) {
            if (confirm("Are you sure want to remove this product from cart?")) {
                new_items = items;
                delete new_items[e];

                dispatch({
                    type: "CART_UPDATE",
                    qty: parseInt(qty) + (parseInt(next_qty) - parseInt(prev_qty)),
                    items: new_items,
                });

                return false;
            } else {
                return false;
            }
        }

        new_items = {
            ...items,
            [e]: {
                ...items[e],
                qty: next_qty,
            },
        };

        dispatch({
            type: "CART_UPDATE",
            qty: parseInt(qty) + (parseInt(next_qty) - parseInt(prev_qty)),
            items: new_items,
        });
    };

    if (Object.keys(items).length === 0) {
        item_listing = (
            <tr>
                <td colSpan={4} style={{ textAlign: "center" }}>
                    You have no product in cart.
                </td>
            </tr>
        );
    } else {
        item_listing = Object.keys(items).map((key) => {
            let item = items[key];
            return (
                <tr key={key}>
                    <td>{item.sku}</td>
                    <td>
                        <div className="item-name">
                            <span className="item-name-img">
                                <Link href="/product/[slug]" as={`/product/${item.url_key}`}>
                                    <span className="img" style={{ backgroundImage: `url(${item.image})` }} />
                                </Link>
                            </span>
                            <span className="item-name-name">
                                <Link href="/product/[slug]" as={`/product/${item.url_key}`}>
                                    {item.name}
                                </Link>
                            </span>
                        </div>
                    </td>
                    <td>
                        <input
                            type="number"
                            min={0}
                            onChange={(e) => handleUpdateQty(key, item.qty, e.target.value)}
                            value={item.qty}
                        />
                    </td>
                    <td>{parseInt(item.price) * parseInt(item.qty)}</td>
                </tr>
            );
        });
    }

    return (
        <DefaultLayout enableCart={false}>
            <h1 className="page-title">Cart</h1>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>SKU</th>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>{item_listing}</tbody>
            </table>
            <style jsx global>{`
                .item-name {
                    display: flex;
                    align-items: center;
                }

                .item-name-img .img {
                    background-color: #eee;
                    border-radius: 50%;
                    box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
                    display: block;
                    width: 64px;
                    height: 64px;
                    background-size: cover;
                    background-position: center;
                }

                .item-name-name {
                    padding-left: 16px;
                }
            `}</style>
        </DefaultLayout>
    );
};

export default compose(withApollo, withRedux)(Cart);
