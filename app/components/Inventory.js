// components/Inventory.js
import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  Pagination,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import InventoryList from './InventoryList';
import AddItemModal from './AddItemModal';

export default function Inventory({ 
  inventory, 
  categories, 
  updateItem, 
  deleteItem, 
  addItem,
  currentPage,
  totalPages,
  onPageChange
}) {
  const [openAddModal, setOpenAddModal] = useState(false);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Inventory Items
        </Typography>
        <Button 
          startIcon={<AddIcon />} 
          variant="contained" 
          color="primary" 
          onClick={() => setOpenAddModal(true)}
        >
          Add Item
        </Button>
      </Box>
      <InventoryList 
        items={inventory}
        updateItem={updateItem}
        deleteItem={deleteItem}
        categories={categories}
      />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination 
          count={totalPages} 
          page={currentPage} 
          onChange={onPageChange} 
          color="primary" 
        />
      </Box>
      <AddItemModal 
        open={openAddModal}
        handleClose={() => setOpenAddModal(false)}
        addItem={addItem}
        categories={categories}
      />
    </Paper>
  );
}