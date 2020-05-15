import { useState } from "react";
import { useRouter } from "next/router";
import gql from "graphql-tag";
import { compose } from "redux";
import { withApollo } from "../../lib/apollo";
import { withRedux } from "../../lib/redux";
import { useQuery } from "@apollo/react-hooks";
import DefaultLayout from "../../components/layout/default";
import Link from "../../lib/Link";

const CATEGORY_QUERY = gql`
    query getCategoryById($id: String!, $page: Int!) {
        categoryList(filters: { ids: { eq: $id } }) {
            name
            url_key
            image_path
            description
            products(pageSize: 10, currentPage: $page) {
                items {
                    id
                    name
                    url_key
                    description {
                        html
                    }
                    image {
                        url
                    }
                    small_image {
                        url
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
                    short_description {
                        html
                    }
                }
            }
        }
    }
`;

const CategoryPage = () => {
    const [test, setTest] = useState(1);
    const router = useRouter();

    const page = typeof router.query.p !== "undefined" ? router.query.p : 1;

    const { loading, error, data } = useQuery(CATEGORY_QUERY, {
        variables: { id: router.query.id, page: page },
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error</div>;
    }

    const category = data.categoryList[0];

    return (
        <DefaultLayout>
            <h1>{category.name}</h1>
            <div className="product-list">
                {category.products.items.map((item) => (
                    <div key={item.id} className="product-item">
                        <div className="item-image">
                            <img src={item.image.url} />
                        </div>
                        <div className="item-information">
                            <Link href="/product/[slug]" as={`/product/${item.url_key}`} className="item-link">
                                {item.name}
                            </Link>
                            <p className="item-description">{item.short_description.html}</p>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                header {
                    padding-top: 12px;
                    padding-bottom: 16px;
                }

                h1 {
                    font-size: 28px;
                    margin-bottom: 32px;
                    padding-bottom: 32px;
                    border-bottom: solid 1px #ccc;
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
            `}</style>
        </DefaultLayout>
    );
};

export default compose(withApollo, withRedux)(CategoryPage);
