import gql from "graphql-tag";
import { withApollo } from "../lib/apollo";
import { useQuery } from "@apollo/react-hooks";
import { PlpLayout } from "../components/layout";
import Link from "../lib/Link";

class category {
    constructor(props) {
        super(props);
        const { loading, data } = useQuery(this.CATEGORY_QUERY);
    }

    const CATEGORY_QUERY = gql`
        {
            category(id: 2) {
                products {
                    items {
                        name
                    }
                }
            }
        }
    `;

    render = () => {
        return (
            <PlpLayout>
                <div>
                    <p>
                        <Link href="/index">&larr; Back to Index</Link>
                    </p>
                    <ul>
                        <li>
                            <Link href="/category/satu">Category 1</Link>
                            <Link href="/category/dua">Category 2</Link>
                        </li>
                    </ul>
                </div>
            </PlpLayout>
        );
    };
}

export default withApollo(category);
