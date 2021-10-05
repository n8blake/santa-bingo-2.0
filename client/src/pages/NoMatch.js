import React from "react";
import "./NoMatch.scss";

function NoMatch() {
    return (
        <div className="container">
            <div className="no-match-message">
            <h1>404</h1>
            <h2>🙄</h2>
            <p>ugh. the page can't be found.</p>
            </div>
        </div>
    )
}

export default NoMatch;