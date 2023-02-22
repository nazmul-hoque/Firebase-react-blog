import * as React from 'react';
import { Typography } from '@mui/material';
import BlogLayout from '../layout/BlogLayout';

function BlogPost() {
    return (
        <BlogLayout>
            <Typography variant="h4" gutterBottom>
                My First Blog Post
            </Typography>
            <Typography variant="body1" gutterBottom>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Typography>
        </BlogLayout>
    );
}

export default BlogPost;
