import React from 'react';

const ProfileSchema = (userId, email) => {
  return (
    {
      userId: userId,
      firstName: '',
      lastName: '',
      email: email,
      school: '',
      avatar: '',
      city: '',
      work: '',
      summary: '',
    }
  )
}

export default ProfileSchema;