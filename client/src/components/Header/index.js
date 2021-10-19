import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useStoreContext } from "../../utils/GlobalState";
import HeaderRed from '../../assets/SVG/SB_logo_red.svg';
import HeaderGreen from '../../assets/SVG/SB_logo_green.svg';

import './style.scss';

function Header() {
	const location = useLocation();
	const [state, dispatch] = useStoreContext();
	const [inGame, setInGame] = useState(false);

	return(
		<div className="header">
			<div className="jumbotron">
				<Link to="/" style={{ textDecoration: 'none' }}>
					{ inGame ? (
						<img className="logoHero" src={HeaderGreen} alt="Santa Bingo"/>
					) : (
						<img className="logoHero" src={HeaderRed} alt="Santa Bingo"/>
					)}
				</Link>
			</div>
			<nav className="pageLinkBtn">
			{((location.pathname.toLowerCase() ===  '/profile') ||  location.pathname.toLowerCase() ===  '/' ) ? (
				<Link to="/profile" style={{ textDecoration: 'none' }}>
					<i className="bi bi-person-circle"></i>
				</Link>
			) : (
				<div></div>
			)}
			</nav>
		</div>
	);
}

export default Header;