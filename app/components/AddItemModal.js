// components/AddItemModal.js
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';

export default function AddItemModal({ open, handleClose, addItem, categories }) {
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    price: ''
  });

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    addItem(newItem);
    setNewItem({ name: '', category: '', quantity: '', unit: '', price: '' });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Item</DialogTitle>
      <DialogContent>
        <TextField
          name="name"
          label="Name"
          value={newItem.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            name="category"
            value={newItem.category}
            onChange={handleChange}
            required
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>{category}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          name="quantity"
          label="Quantity"
          type="number"
          value={newItem.quantity}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="unit"
          label="Unit"
          value={newItem.unit}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="price"
          label="Price"
          type="number"
          value={newItem.price}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Add</Button>
      </DialogActions>
    </Dialog>
  );
}