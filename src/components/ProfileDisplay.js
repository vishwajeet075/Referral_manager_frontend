import React, { useState, useEffect } from 'react';
import { getUserProfile, generateReferralLink } from '../utils/api';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Avatar,
  TextField,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  IconButton,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  Share as ShareIcon,
  LinkOutlined as LinkIcon,
  CheckCircleOutline as CheckIcon
} from '@mui/icons-material';

// Styled components
const ProfileHeader = styled(Box)(({ theme }) => ({
  position: 'relative',
  background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
  padding: theme.spacing(4),
  height: 120,
}));

const ProfileContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginTop: -64,
  padding: theme.spacing(3),
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: '4px solid white',
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.primary.main,
  fontSize: 48,
  fontWeight: 'bold',
}));

const ProfileCard = styled(Card)(({ theme }) => ({
  overflow: 'visible',
  borderRadius: 16,
  boxShadow: theme.shadows[3],
  marginBottom: theme.spacing(3),
}));

const StatCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  borderRadius: 12,
  transition: 'all 0.3s ease',
  background: 'linear-gradient(to bottom right, #F5F7FF, #EEF2FF)',
  border: '1px solid #E0E7FF',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const StepItem = styled(Paper)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: 12,
  marginBottom: theme.spacing(2),
  transition: 'all 0.2s ease',
  background: '#F9FAFC',
  '&:hover': {
    background: '#F5F7FF',
    transform: 'translateX(4px)',
  },
}));

const StepNumber = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  fontWeight: 'bold',
  marginRight: theme.spacing(2),
}));

const ProfileDisplay = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        console.log(data);
        setProfileData(data.profile);
        if (data.profile.referralId) {
          setReferralLink(`${window.location.origin}/referral/${data.profile.referralId}`);
        }
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle profile picture
  const getProfilePictureUrl = () => {
    if (!profileData || !profileData.profilePicture) return null;
    return profileData.profilePicture;
  };

  // Handle referral link generation
  const handleGenerateReferralLink = async () => {
    try {
      const response = await generateReferralLink();
      const { referralId } = response;
      const newReferralLink = `${window.location.origin}/referral/${referralId}`;
      setReferralLink(newReferralLink);
    } catch (err) {
      setError(err.message || 'Failed to generate referral link');
      setSnackbarOpen(true);
    }
  };

  // Copy referral link to clipboard
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setSnackbarOpen(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Show loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading profile...
        </Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box maxWidth="lg" sx={{ mx: 'auto' }}>
      <ProfileCard>
        <ProfileHeader />
        <ProfileContent>
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
            <Box>
              {getProfilePictureUrl() ? (
                <ProfileAvatar src={getProfilePictureUrl()} alt={profileData.name} />
              ) : (
                <ProfileAvatar>
                  {profileData.name ? profileData.name.charAt(0).toUpperCase() : '?'}
                </ProfileAvatar>
              )}
            </Box>

            <Box flex={1} mt={{ xs: 2, md: 0 }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {profileData.name}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {profileData.bio}
              </Typography>

              <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
                {profileData.links &&
                  profileData.links.map(
                    (link, index) =>
                      link.platform &&
                      link.url && (
                        <Chip
                          key={index}
                          icon={getPlatformIcon(link.platform)}
                          label={link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                          component="a"
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          clickable
                          variant="outlined"
                          color="primary"
                          sx={{ borderRadius: 8 }}
                        />
                      )
                  )}
              </Box>
            </Box>

            <Box position={{ xs: 'relative', md: 'absolute' }} top={16} right={16}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                sx={{ 
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(4px)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                  }
                }}
              >
                Edit Profile
              </Button>
            </Box>
          </Box>
        </ProfileContent>

        <Divider />

        <CardContent>
          <Box mb={4}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Your Referral Link
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Share this link with your network to earn points when they sign up
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<ShareIcon />}
                sx={{ borderRadius: 2 }}
              >
                Share
              </Button>
            </Box>

            {referralLink ? (
              <Box display="flex" gap={2} mt={3} flexDirection={{ xs: 'column', sm: 'row' }}>
                <TextField
                  fullWidth
                  value={referralLink}
                  variant="outlined"
                  InputProps={{
                    readOnly: true,
                    sx: { borderRadius: 2 }
                  }}
                />
                <Button
                  variant="contained"
                  color={copied ? 'success' : 'primary'}
                  startIcon={copied ? <CheckIcon /> : <CopyIcon />}
                  onClick={copyReferralLink}
                  sx={{ borderRadius: 2, minWidth: 120 }}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateReferralLink}
                sx={{ mt: 2, borderRadius: 2 }}
              >
                Generate Referral Link
              </Button>
            )}
          </Box>

          <Divider sx={{ my: 4 }} />

          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={4}>
              <StatCard elevation={1}>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {profileData.referrals || 0}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Referrals
                </Typography>
              </StatCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard elevation={1}>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {profileData.points || 0}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Points Earned
                </Typography>
              </StatCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <StatCard elevation={1}>
                <Typography variant="h4" color="primary.main" fontWeight="bold">
                  {profileData.rewards || 0}  
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Rewards Claimed
                </Typography>
              </StatCard>
            </Grid>
          </Grid>

          <Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Start Earning Points
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Share your referral link with friends and colleagues to start earning points!
            </Typography>

            <Box mt={3}>
              <StepItem elevation={0}>
                <StepNumber>1</StepNumber>
                <Typography>Copy your unique referral link</Typography>
              </StepItem>
              <StepItem elevation={0}>
                <StepNumber>2</StepNumber>
                <Typography>Share it on social media or via email</Typography>
              </StepItem>
              <StepItem elevation={0}>
                <StepNumber>3</StepNumber>
                <Typography>Earn points when someone signs up using your link</Typography>
              </StepItem>
            </Box>
          </Box>
        </CardContent>
      </ProfileCard>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity={error ? "error" : "success"} 
          sx={{ width: '100%' }}
        >
          {error ? error : "Link copied to clipboard!"}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Helper function to get platform icon
const getPlatformIcon = (platform) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return <LinkIcon />;
    case 'twitter':
      return <LinkIcon />;
    case 'instagram':
      return <LinkIcon />;
    case 'facebook':
      return <LinkIcon />;
    case 'github':
      return <LinkIcon />;
    case 'website':
      return <LinkIcon />;
    default:
      return <LinkIcon />;
  }
};

export default ProfileDisplay;