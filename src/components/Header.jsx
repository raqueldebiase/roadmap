import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import profileWizard from '../assets/gandalf8bit.png';
import { useAuth } from '../AuthContext';
import GandalfMessage from './gandalfMessage';
import { auth } from '../firebase';
import Cookies from 'js-cookie';

const Header = ({ onResetProgress }) => {
  const { currentUser, setCurrentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setShowMenu(!showMenu);
  };

  const handleOutsideClick = (event) => {
    if (!event.target.closest(`.${styles.profileMenu}`) && !event.target.closest(`.${styles.profileImg}`)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showMenu]);

  const handleLogout = () => {
    try {
      setCurrentUser(null);
      auth.signOut();
      Cookies.remove('readingProgress');
      navigate('/login');
      console.log('Logout successful.');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div>
          <h1>MithrilMap</h1>
          <p className={styles.logoTitle} to="/" aria-label='Home'>In Gandalf we trust</p>
        </div>
        {currentUser && (
          <div className={styles.profileContainer}>
            <img 
              src={profileWizard} 
              alt="Wizard" 
              className={`${styles.profileImg} ${styles.imageLoggedIn}`}
              onClick={handleProfileClick}
            />
            {showMenu && (
              <div className={styles.profileMenu}>
                {location.pathname === '/profile' && (
                  <Link to='/home'>Homepage</Link>
                )}
                {location.pathname === '/home' && (
                  <Link to='/profile'>Your journey</Link>
                )}
                {location.pathname === '/booklist' && (
                  <>
                    <Link to='/home'>Homepage</Link>
                    <Link to='/profile'>Your journey</Link>
                  </>
                )}
                {location.pathname !== '/booklist' && (
                  <Link to='/booklist'>Books list</Link>
                )}
                <button className={styles.exit} onClick={handleLogout}>Exit</button>
              </div>
            )}
          </div>
        )}
      </nav>
      {showModal && <GandalfMessage onClose={() => setShowModal(false)} />}
    </header>
  );
};

export default Header;
