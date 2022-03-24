import { useContext } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../../store/auth-context';
import classes from './MainNavigation.module.css';

const MainNavigation = () => {
	const authCtx = useContext(AuthContext);

	const isLoggedIn = authCtx.isLoggedIn;

	const logoutHandler = () => {
		authCtx.logout();
	};
	return (
		<header className={classes.header}>
			<Link to="/">
				<div className={classes.logo}>React Auth</div>
			</Link>
			<nav>
				<ul>
					{!isLoggedIn && (
						<li>
							<Link to="/auth">Login</Link>
						</li>
					)}
					{isLoggedIn && (
						<li>
							<Link to="/profile">Profile</Link>
						</li>
					)}
					{isLoggedIn && (
						<li>
							<button onClick={logoutHandler}>Logout</button>
						</li>
					)}
				</ul>
			</nav>
		</header>
	);
};

export default MainNavigation;

/**
 * @authCtx - we check the login state via the authCtx and conditionally render our UI.
 *
 * @logouthandler -  to log out, we do not need send any req to database, this is a stateless DB.Meaning, does not store anything about this login/logout state. To logout we simply set the token to its init state, which is null. This we already done it inside our authContext. Thereofre, we simply access that function here via context.
 */
