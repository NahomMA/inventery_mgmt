// components/InventoryList.js
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon
} from '@mui/icons-material';

export default function InventoryList({ items, updateItem, deleteItem, categories }) {
  const [editingItem, setEditingItem] = useState(null);

  const handleEdit = (item) => {
    setEditingItem(item);
  };

  const handleCloseEdit = () => {
    setEditingItem(null);
  };

  const handleSaveEdit = () => {
    updateItem(editingItem);
    setEditingItem(null);
  };

  const handleChange = (e) => {
    setEditingItem({ ...editingItem, [e.target.name]: e.target.value });
  };

  const handleQuantityChange = (item, change) => {
    const newQuantity = Math.max(0, item.quantity + change);
    updateItem({ ...item, quantity: newQuantity });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Date Added</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleQuantityChange(item, -1)} size="small">
                    <RemoveIcon />
                  </IconButton>
                  <Typography component="span" sx={{ mx: 1 }}>
                    {item.quantity} {item.unit}
                  </Typography>
                  <IconButton onClick={() => handleQuantityChange(item, 1)} size="small">
                    <AddIcon />
                  </IconButton>
                </TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>{item.dateAdded?.toDate().toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteItem(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!editingItem} onClose={handleCloseEdit}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          {editingItem && (
            <>
              <TextField 
                name="name" 
                label="Name" 
                value={editingItem.name} 
                onChange={handleChange} 
                fullWidth 
                margin="normal" 
                disabled
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={editingItem.category}
                  onChange={handleChange}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField 
                name="unit" 
                label="Unit" 
                value={editingItem.unit} 
                onChange={handleChange} 
                fullWidth 
                margin="normal"
              />
              <TextField 
                name="price" 
                label="Price" 
                type="number" 
                value={editingItem.price} 
                onChange={handleChange} 
                fullWidth 
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}