import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../reducers/user';
import { removeAllBookmark } from '../reducers/bookmarks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'antd';
import Link from 'next/link';
import Moment from 'react-moment';
import styles from '../styles/Header.module.css';

function Header() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user.value);

	const [date, setDate] = useState('2050-11-22T23:59:59');
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [signUpUsername, setSignUpUsername] = useState('');
	const [signUpPassword, setSignUpPassword] = useState('');
	const [signInUsername, setSignInUsername] = useState('');
	const [signInPassword, setSignInPassword] = useState('');

	useEffect(() => {
		setDate(new Date());
	}, []);

	const handleRegister = () => {
		fetch('http://localhost:3000/users/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: signUpUsername, password: signUpPassword }),
		}).then(response => response.json())
			.then(data => {
				if (data.result) {
					dispatch(login({ username: signUpUsername, token: data.token }));
					setSignUpUsername('');
					setSignUpPassword('');
					setIsModalVisible(false)
				}
			});
	};

	const handleConnection = () => {
		fetch('http://localhost:3000/users/signin', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username: signInUsername, password: signInPassword }),
		}).then(response => response.json())
			.then(data => {
				if (data.result) {
					dispatch(login({ username: signInUsername, token: data.token }));
					setSignInUsername('');
					setSignInPassword('');
					setIsModalVisible(false);
				}
			});
	};

	const handleLogout = () => {
		dispatch(logout());
		dispatch(removeAllBookmark());
	};

	const showModal = () => {
		setIsModalVisible(!isModalVisible);
	};

	let modalContent;
	if (!user.token) {
		modalContent = (
			<div className={styles.registerContainer}>
				<div className={styles.registerSection}>
					<p>Sign-up</p>
					<input type="text" placeholder="Username" id="signUpUsername" onChange={(e) => setSignUpUsername(e.target.value)} value={signUpUsername} />
					<input type="password" placeholder="Password" id="signUpPassword" onChange={(e) => setSignUpPassword(e.target.value)} value={signUpPassword} />
					<button id="register" onClick={() => handleRegister()}>Register</button>
				</div>
				<div className={styles.registerSection}>
					<p>Sign-in</p>
					<input type="text" placeholder="Username" id="signInUsername" onChange={(e) => setSignInUsername(e.target.value)} value={signInUsername} />
					<input type="password" placeholder="Password" id="signInPassword" onChange={(e) => setSignInPassword(e.target.value)} value={signInPassword} />
					<button id="connection" onClick={() => handleConnection()}>Connect</button>
				</div>
			</div>
		);
	}

	let userSection;
	if (user.token) {
		userSection = (
			<div className={styles.logoutSection}>
				<p>Welcome {user.username} / </p>
				<button onClick={() => handleLogout()}>Logout</button>
			</div>
		);
	} else {
		if (isModalVisible) {
			userSection = <FontAwesomeIcon onClick={showModal} className={styles.userSection} icon={faXmark} />;
		} else {
			userSection = <FontAwesomeIcon onClick={showModal} className={styles.userSection} icon={faUser} />;
		}
	}

	return (
		<header className={styles.header}>
			<div className={styles.logoContainer}>
				<Moment className={styles.date} date={date} format="MMM Do YYYY" />
				<h1 className={styles.title}>Morning News</h1>
				{userSection}
			</div>

			<div className={styles.linkContainer}>
				<Link href="/"><span className={styles.link}>Articles</span></Link>
				<Link href="/bookmarks"><span className={styles.link}>Bookmarks</span></Link>
			</div>

			{isModalVisible && <div id="react-modals">
				<Modal getContainer="#react-modals" className={styles.modal} visible={isModalVisible} closable={false} footer={null}>
					{modalContent}
				</Modal>
			</div>}
		</header >
	);
}

export default Header;
