import React from 'react';
import PropTypes from 'prop-types'
import { Box } from '@mui/material'
import { styled } from '@mui/system';

export default function Review ({ rating, comment }) {
  const Label = styled('span')({
    color: '#286ee6'
  })

  return (
    <Box
      sx={{
        border: 'solid',
        borderRadius: '10px',
        borderColor: '#6392e3 ',
        borderWidth: '0.1px',
        padding: '5px',
        margin: '5px',
        textAlign: 'center',
        width: '200px'
      }}
      name='box'
    >
      <h3 style={{ color: '#286ee6' }}>Review</h3>
      <p>
        <Label>Rating:</Label> {rating}
      </p>
      <p style={{ overflowWrap: 'break-word' }}>{comment}</p>
    </Box>
  );
}

Review.propTypes = {
  rating: PropTypes.number,
  comment: PropTypes.string
}
