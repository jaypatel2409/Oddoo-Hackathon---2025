import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      emailVerified: payload.email_verified
    };
  } catch (error) {
    throw new Error('Invalid Google token');
  }
};

export const handleGoogleAuth = async (googleData) => {
  try {
    // Check if user exists with Google ID
    let user = await User.findOne({ googleId: googleData.googleId });

    if (!user) {
      // Check if user exists with email
      user = await User.findOne({ email: googleData.email });

      if (user) {
        // Link existing account with Google ID
        user.googleId = googleData.googleId;
        user.isEmailVerified = googleData.emailVerified;
        if (googleData.picture && !user.profilePhoto?.url) {
          user.profilePhoto = {
            url: googleData.picture,
            publicId: null
          };
        }
        await user.save();
      } else {
        // Create new user
        user = await User.create({
          googleId: googleData.googleId,
          email: googleData.email,
          name: googleData.name,
          profilePhoto: {
            url: googleData.picture,
            publicId: null
          },
          isEmailVerified: googleData.emailVerified
        });
      }
    } else {
      // Update existing Google user
      user.lastActive = new Date();
      if (googleData.picture && user.profilePhoto?.url !== googleData.picture) {
        user.profilePhoto = {
          url: googleData.picture,
          publicId: null
        };
      }
      await user.save();
    }

    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      location: user.location,
      introduction: user.introduction,
      profilePhoto: user.profilePhoto,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      isProfileComplete: user.isProfileComplete,
      token: generateToken(user._id)
    };
  } catch (error) {
    throw new Error('Google authentication failed');
  }
}; 