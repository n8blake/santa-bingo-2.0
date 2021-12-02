import React from 'react';
import { Link } from 'react-router-dom';
import { useStoreContext } from "../../utils/GlobalState";
import HeaderRed from '../../assets/SVG/SB_logo_red.svg';
import HeaderGreen from '../../assets/SVG/SB_logo_green.svg';

import './Header.scss';

function Header() {

	const [state] = useStoreContext();

	return(
		<div className="header">
			{ state.inGame ? (
				<div className="game-bg bg-grad-green"></div>
			) : (
				<div className="game-bg bg-grad-red"></div>
			)}
			<div className="jumbotron">
				<Link to={'/'} style={{ textDecoration: 'none' }}>
					{ state.inGame ? (
						<img className="logoHero" src={HeaderGreen} alt="Santa Bingo"/>
					) : (
						<img className="logoHero" src={HeaderRed} alt="Santa Bingo"/>
					)}
				</Link>
			</div>
			<nav className="pageLinkBtn">
				<Link to="/profile" style={{ textDecoration: 'none' }}>
					{
						state.user ? (
							<span className="user-display-monogram">{state.user.displayName}</span>
						) : (
							<i className="bi bi-person-circle"></i>
						)
					}
					
				</Link>
			</nav>
		</div>
	);
}

export default Header;