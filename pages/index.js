import gql from "graphql-tag";
import { compose } from "redux";
import { withApollo } from "../lib/apollo";
import { withRedux } from "../lib/redux";
import { useQuery } from "@apollo/react-hooks";
import DefaultLayout from "../components/layout/default";
import Link from "../lib/Link";

const CATEGORIES_QUERY = gql`
    {
        categoryList {
            children {
                id
                name
                children {
                    id
                    name
                    children {
                        id
                        name
                    }
                }
            }
        }
    }
`;

const index = () => {
    const { loading, data } = useQuery(CATEGORIES_QUERY);

    if (loading) {
        return <div key="nothing">Loading...</div>;
    }

    const categories = data.categoryList[0].children;

    return (
        <DefaultLayout>
            <ul>
                {categories.map((category, index) => (
                    <li key={index}>
                        <Link href="/category/[id]" as={`/category/${category.id}`}>
                            {category.name}
                        </Link>
                        <ul>
                            {category.children.map((category_child1, index) => (
                                <li key={index}>
                                    <Link href="/category/[id]" as={`/category/${category_child1.id}`}>
                                        {category_child1.name}
                                    </Link>
                                    <ul>
                                        {category_child1.children.map((category_child2, index) => (
                                            <li key={index}>
                                                <Link href="/category/[id]" as={`/category/${category_child2.id}`}>
                                                    {category_child2.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </DefaultLayout>
    );
};

export default compose(withApollo, withRedux)(index);
