import React from "react";
import LinkNext from "./LinkNext";

const Link = ({ children, ...props }) => {
    return <LinkNext {...props}>{children}</LinkNext>;
};

export default Link;
