import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Chip,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import {
    Block as BlockIcon,
    CheckCircle as CheckCircleIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import { adminAPI } from '../../services/api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getUsers();
            if (response.data.success) {
                setUsers(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async (userId) => {
        try {
            const response = await adminAPI.toggleUserStatus(userId);
            if (response.data.success) {
                // Update the user status in the local state
                setUsers(users.map(user => 
                    user._id === userId 
                        ? { ...user, isBlocked: !user.isBlocked }
                        : user
                ));
            }
        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    };

    const handleViewDetails = (user) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" m={3}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                User Management
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Last Login</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Chip 
                                        label={user.role}
                                        color={user.role === 'admin' ? 'primary' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.isBlocked ? 'Blocked' : 'Active'}
                                        color={user.isBlocked ? 'error' : 'success'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                                </TableCell>
                                <TableCell>
                                    <IconButton 
                                        onClick={() => handleViewDetails(user)}
                                        color="primary"
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton 
                                        onClick={() => handleToggleStatus(user._id)}
                                        color={user.isBlocked ? 'success' : 'error'}
                                    >
                                        {user.isBlocked ? <CheckCircleIcon /> : <BlockIcon />}
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* User Details Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>User Details</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ minWidth: 300, pt: 1 }}>
                            <Typography><strong>Name:</strong> {selectedUser.name}</Typography>
                            <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
                            <Typography><strong>Role:</strong> {selectedUser.role}</Typography>
                            <Typography><strong>Status:</strong> {selectedUser.isBlocked ? 'Blocked' : 'Active'}</Typography>
                            <Typography><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</Typography>
                            <Typography><strong>Last Login:</strong> {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UserManagement; 