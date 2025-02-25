import React from 'react';
import {
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';

/**
 * 投稿削除用メニューとダイアログの共通コンポーネント
 */
const DeleteMenu = ({
  anchorEl,
  openDialog,
  onMenuClose,
  onDialogOpen,
  onDialogClose,
  onDelete,
}) => {
  const openMenu = Boolean(anchorEl);

  return (
    <>
      {/* 削除用メニュー */}
      <Menu
        id="delete-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={onMenuClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: '20ch',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
          },
        }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={onDialogOpen}>
          <DeleteOutlineOutlinedIcon fontSize="small" style={{ marginRight: '8px' }} />
          削除
        </MenuItem>
      </Menu>

      {/* 削除確認ダイアログ */}
      <Dialog
        open={openDialog}
        onClose={onDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        BackdropProps={{ invisible: true }}
        PaperProps={{
          style: {
            boxShadow:
              '0px 1px 3px -1px rgba(0,0,0,0.1), 0px 1px 1px 0px rgba(0,0,0,0.06), 0px 1px 1px -1px rgba(0,0,0,0.04)',
            borderRadius: '16px',
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">ポストの削除</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ポストを完全に削除しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDialogClose();
            }}
            sx={{
              borderRadius: '20px',
              ':hover': {
                boxShadow: '0px 4px 20px rgba(173, 216, 230, 1)',
              },
            }}
          >
            キャンセル
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            autoFocus
            sx={{
              borderRadius: '20px',
              ':hover': {
                boxShadow: '0px 4px 20px rgba(173, 216, 230, 1)',
              },
            }}
          >
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteMenu;
