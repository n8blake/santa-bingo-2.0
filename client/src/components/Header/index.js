import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useStoreContext } from "../../utils/GlobalState";

import './style.scss';

function Header() {
	const location = useLocation();

	const [state, dispatch] = useStoreContext();

	return(
		<div className="jumbotron">
			<h1 className="display hero-text">Santa Bingo</h1>
			<nav className="pageLinkBtn">
			{((location.pathname.toLowerCase() ===  '/search') ||  location.pathname.toLowerCase() ===  '/' ) ? (
				<Link to="/profile" style={{ textDecoration: 'none' }}>
					<i className="bi bi-person-circle"></i>
					<div className="link-text">profile</div>
				</Link>
			) : (
				<div></div>
			)}
			</nav>
		</div>
	);
}

export default Header;