import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Grid, Paper, Typography, AppBar, Toolbar, Button, IconButton, Menu, MenuItem, Divider, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth, provider } from "../config/firebase-config"
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';

const Main = styled('main')(({ theme }) => ({
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
}));

const Appbar = styled(AppBar)(({ theme }) => ({
    marginBottom: theme.spacing(3),
}));

const MainContent = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    '& > * + *': {
        marginTop: theme.spacing(3),
    },
}));

const FeaturedPost = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    marginBottom: theme.spacing(4),
    background: theme.palette.background.default,
}));

const PostCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    background: theme.palette.background.default,
}));

function BlogLayout({ children }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const [posts, setPosts] = React.useState([]);

    const [user, setUser] = React.useState(null);

    // React.useEffect(() => {
    //     const db = firebase.firestore();
    //     const unsubscribe = db.collection('posts').orderBy('date', 'desc').onSnapshot((snapshot) => {
    //         const newPosts = snapshot.docs.map((doc) => ({
    //             id: doc.id,
    //             ...doc.data(),
    //         }));
    //         setPosts(newPosts);
    //     });

    //     return unsubscribe;
    // }, []);


    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser({
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                });
            } else {
                setUser(null);
            }
        });

        return unsubscribe;
    }, []);

    const handleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log(result.user);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSignOut = async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error(error);
        }
    };

    React.useEffect(() => {
        //const q = query(collection(db, 'posts'), orderBy('date', 'desc'));
        const q = query(collection(db, 'posts'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newPosts = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPosts(newPosts);
        });

        return unsubscribe;
    }, []);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <Appbar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={handleMenu}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                        My Blog
                    </Typography>

                    {user ? (
                        <>
                            <Typography variant="body1" sx={{ mr: 1 }}>
                                {user.displayName}
                            </Typography>
                            <Avatar src={user.photoURL} alt={user.displayName} />
                            <Button color="inherit" onClick={handleSignOut}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Button color="inherit" onClick={handleSignIn}>
                            Sign In
                        </Button>
                    )}
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Home</MenuItem>
                        <MenuItem onClick={handleClose}>Categories</MenuItem>
                        <Divider />
                        <MenuItem onClick={handleClose}>About</MenuItem>
                        <MenuItem onClick={handleClose}>Contact</MenuItem>
                    </Menu>
                </Toolbar>
            </Appbar>
            <FeaturedPost>
                <Typography variant="h5" gutterBottom>
                    Featured Post Title
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Featured post subtitle
                </Typography>
            </FeaturedPost>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <MainContent component={Main}>
                        {posts.map((post) => (
                            <PostCard key={post.id}>
                                <Typography variant="h6" gutterBottom>
                                    {post.title}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    {/* {post.date.toDate().toLocaleDateString()} */}
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {post.content}
                                </Typography>
                            </PostCard>
                        ))}
                    </MainContent>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="h6" gutterBottom>
                        Recent Posts
                    </Typography>
                    <PostCard>
                        <Typography variant="subtitle1" gutterBottom>
                            Post Title
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Post summary
                        </Typography>
                    </PostCard>
                    <PostCard>
                        <Typography variant="subtitle1" gutterBottom>
                            Post Title
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Post summary
                        </Typography>
                    </PostCard>
                </Grid>
            </Grid>
        </>
    );
}

export default BlogLayout;
