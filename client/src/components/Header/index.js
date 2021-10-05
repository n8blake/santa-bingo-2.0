import React from 'react';
import { useLocation, Link } from 'react-router-dom'
import './style.scss';

function Header() {
	const location = useLocation();

	return(
		<div className="jumbotron">
			<h1 className="display hero-text">The Library</h1>
			<p className="subtitle hero-subtitle">because reading is fundamental</p>
			<nav className="pageLinkBtn">
			{((location.pathname.toLowerCase() ===  '/search') ||  location.pathname.toLowerCase() ===  '/' ) ? (
				<Link to="/favorites" style={{ textDecoration: 'none' }}>
					<i className="bi bi-heart"></i>
					<div className="link-text">favorites</div>
				</Link>
			) : (
				<Link to="/search" style={{ textDecoration: 'none' }}>
					<i className="bi bi-search"></i>
					<div className="link-text">search</div>
				</Link>
			)}
			</nav>
		</div>
	);
}

export default Header;