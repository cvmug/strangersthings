import React, { useState, useEffect } from 'react';
import DeletePost from './DeletePost';
import './Posts.css';
import MessageButton from '../Messages/MessageButton';

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [token, setToken] = useState(null);
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    setToken(token);

    if (token) {
      fetch('https://strangers-things.herokuapp.com/api/2209-FTB-MT-WEB-PT/users/me', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((result) => {
          const user = result.data;
          setUser(user);
        })
        .catch((error) => console.log(error));
    }
  }, [token]);

  useEffect(() => {
    fetch('https://strangers-things.herokuapp.com/api/2209-FTB-MT-WEB-PT/posts', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.data.posts);
        console.log(data.data.posts);
      });
  }, [token]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        post.author.username.toLowerCase().includes(lowerCaseSearchTerm) ||
        post.location.toLowerCase().includes(lowerCaseSearchTerm) ||
        post.description.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  return (
    <div className="posts">
      <h1>Posts</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredPosts.map((post) => (
        <div key={post._id} className={post.isAuthor ? 'post author' : 'post'}>
          <>
            Title: {post.title}
            <br />
            Author: {post.author.username}
            <br />
            Location: {post.location}
            <br />
            Description: {post.description}
            <br />
            Price: {post.price}
            <br />
            Created at: {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              })}
              <br />
              Updated at: {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              })}

            <br />
            {post.isAuthor ? <button className='edit'>Edit</button> : null}
            {post.isAuthor ? <DeletePost postId={post._id} /> : null}
            {!post.isAuthor && token ? <MessageButton postId={post._id} /> : null}
          </>
        </div>
      ))}
    </div>
  );
};