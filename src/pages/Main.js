import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Link } from 'react-router-dom';
import './Main.css';

import api from '../services/api';

import logo from '../assets/logo.svg';
import dislike from '../assets/dislike.svg';
import like from '../assets/like.svg';
import itsamatch from '../assets/itsamatch.png';

export default function Main({ match }) {
    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(true);

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get('/devs', {
                headers: {
                    user: match.params.id
                }
            });

            setUsers(response.data);
        }

        loadUsers();
    }, [match.params.id]);

    // WebSockets connection for match behaviour
    useEffect(() => {
        const socket = io('http://localhost:3333', {
            query: { user: match.params.id }
        });

        socket.on('match', dev => {
            console.log(dev);
        });
    }, [match.params.id]);

    async function handleLike(id) {
        await api.post(`/devs/${id}/likes`, null, {
            headers: {
                user: match.params.id
            }
        });

        setUsers(users.filter(user => user._id !== id));
    }

    async function handleDislike(id) {
        await api.post(`/devs/${id}/dislikes`, null, {
            headers: {
                user: match.params.id
            }
        });

        setUsers(users.filter(user => user._id !== id));
    }

    return (
        <div className="main-container">
            <Link to="/">
                <img src={logo} alt="Tindev" />
            </Link>
            { users.length > 0 ? (
                <ul>
                    {users.map(user => (
                        <li key={user._id}>
                            <img src={user.avatar} alt={user.name} />
                            <footer>
                                <strong>{user.name}</strong>
                                <p>{user.bio}</p>
                            </footer>

                            <div className="buttons">
                                <button type="button" onClick={() => handleDislike(user._id)}>
                                    <img src={dislike} alt="Dislike"/>
                                </button>
                                <button type="button" onClick={() => handleLike(user._id)}>
                                    <img src={like} alt="Like"/>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="empty">Acabou :(</div>
            ) }

            { matchDev && (
                <div className="match-container">
                    <img src={itsamatch} alt="It's a match" />
                    <img className="avatar" src="https://avatars3.githubusercontent.com/u/8448249?v=4" alt="" />
                    <strong>Adriano Kerber</strong>
                    <p>Affictionated by technology and games, always looking for new ways of coding.</p>

                    <button type="button" onClick={() => setMatchDev(null)}>FECHAR</button>
                </div>
            ) }
        </div>
    );
}