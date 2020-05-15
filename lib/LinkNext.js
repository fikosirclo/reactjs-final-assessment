import Link from "next/link";

const LinkNext = ({ href, as, children, ...props }) => {
    return (
        <Link href={href} as={as}>
            <a {...props}>{children}</a>
        </Link>
    );
};

export default LinkNext;
