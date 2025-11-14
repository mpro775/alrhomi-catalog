import { useEffect, useState } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, 
  Button, Dialog, DialogTitle, DialogContent, TextField, 
  DialogActions, Box, IconButton, Paper, InputAdornment,
  TablePagination, Chip, Avatar, LinearProgress, useTheme,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Search as SearchIcon, 
  Person as PersonIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  CheckCircle as CheckIcon,
  ContentCopy
} from '@mui/icons-material';
import { createUser, fetchUsers, deleteUser } from '../../api/admin';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', role: 'rep' });
  const [created, setCreated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const theme = useTheme();

  // جلب المستخدمين عند التحميل
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const res = await fetchUsers();
        setUsers(res.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadUsers();
  }, []);

  const handleOpen = () => { 
    setForm({ username: '', email: '', role: 'rep' }); 
    setCreated(null); 
    setOpen(true); 
  };
  
  const handleClose = () => setOpen(false);

  const handleCreate = async () => {
    try {
      const res = await createUser(form);  
      setCreated(res.data);
      // إضافة للمصفوفة حتى تظهر فوراً
      setUsers(prev => [...prev, { 
        ...res.data, 
        createdAt: new Date().toISOString(),
        isNew: true 
      }]);
      
     
    } catch (err) {
      console.error('Failed to create user:', err);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteUser(deleteConfirm);
      setUsers(users.filter(u => u._id !== deleteConfirm));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ar-EG', options);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      {/* العنوان وشريط البحث */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' }, 
        justifyContent: 'space-between', 
        alignItems: { xs: 'flex-start', sm: 'center' },
        mb: 3,
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" >
            إدارة المستخدمين
          </Typography>
          <Typography variant="body1" color="text.secondary">
            إدارة حسابات المستخدمين والصلاحيات
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="ابحث عن مستخدم..."
            value={search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ 
              flexGrow: { xs: 1, sm: 0 },
              minWidth: 250,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper
              }
            }}
          />
          
          <Button 
            variant="contained" 
            onClick={handleOpen}
            startIcon={<AddIcon />}
            sx={{ 
              borderRadius: 3,
              px: 3,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              minWidth: 'auto'
            }}
          >
            مستخدم جديد
          </Button>
        </Box>
      </Box>

      {/* محتوى الصفحة */}
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 4, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)', 
          overflow: 'hidden',
          mb: 4
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <LinearProgress sx={{ width: '100%' }} />
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            p: 6,
            textAlign: 'center'
          }}>
            <Box sx={{ 
              bgcolor: theme.palette.background.default, 
              borderRadius: '50%', 
              p: 3,
              mb: 3
            }}>
              <PersonIcon sx={{ fontSize: 60, color: theme.palette.text.secondary }} />
            </Box>
            <Typography variant="h6" sx={{ mb: 1 }}>
              لم يتم العثور على مستخدمين
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {search ? 'لا توجد نتائج مطابقة لبحثك' : 'لم تقم بإضافة أي مستخدمين بعد'}
            </Typography>
            <Button 
              variant="outlined" 
              onClick={handleOpen} 
              startIcon={<AddIcon />}
              sx={{ mt: 3 }}
            >
              إضافة مستخدم جديد
            </Button>
          </Box>
        ) : (
          <>
            <Grid container spacing={3} sx={{ p: 3 }}>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(user => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={user._id}>
                    <Card sx={{ 
                      borderRadius: 3, 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      border: user.isNew ? `2px solid ${theme.palette.success.main}` : 'none',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }
                    }}>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: theme.palette.primary.main, 
                              width: 56, 
                              height: 56,
                              mr: 2,
                              fontSize: 24
                            }}
                          >
                            {user.username.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="h6" >
                              {user.username}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                          <Chip
                            label={user.role === 'rep' ? "مندوب" : "مدير"}
                            color={user.role === 'rep' ? "primary" : "secondary"}
                            size="small"
                          />
                          <Chip
                            label={user.isActive ? "نشط" : "غير نشط"}
                            color={user.isActive ? "success" : "default"}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          <Box component="span" sx={{ color: 'text.primary' }}>
                            تاريخ الإنشاء:
                          </Box> {formatDate(user.createdAt)}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary">
                          <Box component="span" sx={{ color: 'text.primary' }}>
                            آخر نشاط:
                          </Box> {user.lastLogin ? formatDate(user.lastLogin) : 'لم يسجل دخول بعد'}
                        </Typography>
                      </CardContent>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        p: 2, 
                        pt: 0,
                        gap: 1
                      }}>
                        <Tooltip title="تعديل المستخدم">
                          <IconButton size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="حذف المستخدم">
                          <IconButton 
                            size="small" 
                            onClick={() => setDeleteConfirm(user._id)}
                            sx={{
                              color: theme.palette.error.main,
                              '&:hover': {
                                backgroundColor: theme.palette.error.light
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Card>
                  </Grid>
                ))}
            </Grid>
            
            <TablePagination
              component="div"
              count={filteredUsers.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[6, 12, 18]}
              labelRowsPerPage="مستخدمين لكل صفحة:"
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} من ${count}`}
              sx={{ 
                borderTop: `1px solid ${theme.palette.divider}`,
                '& .MuiTablePagination-toolbar': {
                  flexWrap: 'wrap',
                  justifyContent: 'center'
                }
              }}
            />
          </>
        )}
      </Paper>

      {/* حوار إنشاء مستخدم جديد */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2
        }}>
          <Typography variant="h6" >
            إنشاء مستخدم جديد
          </Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ py: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="اسم المستخدم"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="البريد الإلكتروني"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                fullWidth
                label="الدور"
                value={form.role}
                onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                variant="outlined"
                size="small"
                SelectProps={{ native: true }}
              >
                <option value="rep">مندوب</option>
                <option value="admin">مدير</option>
              </TextField>
            </Grid>
            
            {created && (
              <Grid size={{ xs: 12 }}>
                <Box sx={{ 
                  bgcolor: theme.palette.success.light, 
                  borderRadius: 2, 
                  p: 2,
                  mt: 1
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CheckIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                    <Typography variant="subtitle1" >
                      تم إنشاء المستخدم بنجاح!
                    </Typography>
                  </Box>
                  <Typography variant="body2">
                    كلمة المرور المؤقتة للمستخدم: 
                    <Box component="span" sx={{ 
                      bgcolor: theme.palette.background.paper, 
                      p: 1, 
                      borderRadius: 1,
                      display: 'inline-block',
                      ml: 1,
                      fontFamily: 'monospace'
                    }}>
                      {created.tempPassword}
                    </Box>
                  </Typography>
                 <IconButton
          size="small"
          onClick={() => navigator.clipboard.writeText(created.tempPassword)}
        >
          <ContentCopy fontSize="small" />
        </IconButton>
                </Box>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ 
          px: 3, 
          py: 2, 
          borderTop: `1px solid ${theme.palette.divider}` 
        }}>
          <Button 
            onClick={handleClose} 
            variant="outlined"
            sx={{ borderRadius: 3 }}
            disabled={!!created}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={!form.username || !form.email || !!created}
            sx={{ borderRadius: 3, px: 4 }}
          >
            إنشاء مستخدم
          </Button>
        </DialogActions>
      </Dialog>

      {/* حوار تأكيد الحذف */}
      <Dialog 
        open={!!deleteConfirm} 
        onClose={() => setDeleteConfirm(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
          pb: 2
        }}>
            <Typography variant="h6" >
            تأكيد الحذف
          </Typography>
          <IconButton onClick={() => setDeleteConfirm(null)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ py: 3 }}>
          <Typography variant="body1">
            هل أنت متأكد أنك تريد حذف هذا المستخدم؟ هذا الإجراء لا يمكن التراجع عنه.
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ 
          px: 3, 
          py: 2, 
          borderTop: `1px solid ${theme.palette.divider}` 
        }}>
          <Button 
            onClick={() => setDeleteConfirm(null)} 
            variant="outlined"
            sx={{ borderRadius: 3 }}
          >
            إلغاء
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            sx={{ borderRadius: 3, px: 4 }}
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}