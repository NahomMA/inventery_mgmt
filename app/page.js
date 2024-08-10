'use client'
import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  ThemeProvider,
  createTheme,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Menu as MenuIcon, Search as SearchIcon } from '@mui/icons-material';
import Sidebar from './components/Sidebar';
import Inventory from './components/Inventory';
import Categories from './components/Categories';
import Settings from './components/Settings';
import { db } from '../firebase';
import {
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  serverTimestamp,
  orderBy,
  limit,
  startAfter,
  where,
  getCountFromServer,
} from 'firebase/firestore';

const drawerWidth = 240;
const ITEMS_PER_PAGE = 10;

// Fixed general categories
const GENERAL_CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Books', 'Other'];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState(GENERAL_CATEGORIES);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [currentView, setCurrentView] = useState('inventory');
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastVisible, setLastVisible] = useState(null);
  const [isFirstPage, setIsFirstPage] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);


  const handleCategorySelect = async (category) => {
    setSelectedCategory(category);
    setCurrentView('inventory');
    await fetchInventory(1, category);
  };


  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  useEffect(() => {
    setupGeneralCategories();
    fetchInventory(1);
  }, [searchTerm, sortOption, currentView, selectedCategory]);

  const setupGeneralCategories = async () => {
    const categoriesRef = doc(db, 'settings', 'categories');
    await setDoc(categoriesRef, { generalCategories: GENERAL_CATEGORIES }, { merge: true });
    setCategories(GENERAL_CATEGORIES);
  };

  const fetchInventory = async (page = 1, category = selectedCategory) => {
    if (currentView !== 'inventory') return;
  
    let q = collection(db, 'inventory');
  
    if (searchTerm) {
  q = query(q, where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
}

  
    if (category) {
      q = query(q, where('category', '==', category));
    }
  
    q = query(q, orderBy(sortOption === 'date' ? 'dateAdded' : 'name'));
  
    // Get total count for pagination
    const countSnapshot = await getCountFromServer(q);
    const totalItems = countSnapshot.data().count;
    setTotalPages(Math.ceil(totalItems / ITEMS_PER_PAGE));
  
    if (page === 1) {
      q = query(q, limit(ITEMS_PER_PAGE));
      setIsFirstPage(true);
    } else if (lastVisible) {
      q = query(q, startAfter(lastVisible), limit(ITEMS_PER_PAGE));
      setIsFirstPage(false);
    } else {
      console.error("Unable to fetch this page. No reference to the last visible document.");
      return;
    }
  
    const querySnapshot = await getDocs(q);
    const inventoryData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  
    setInventory(inventoryData);
    setCurrentPage(page);
    setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
  };


  

  const handlePageChange = async (event, value) => {
    if (value === 1 || (value > currentPage && lastVisible)) {
      await fetchInventory(value);
    } else if (value < currentPage) {
      // For going backwards, we need to refetch from the start
      setLastVisible(null);
      await fetchInventory(1);
      for (let i = 1; i < value; i++) {
        await fetchInventory(i + 1);
      }
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleAddItem = async (newItem) => {
    try {
      await addDoc(collection(db, 'inventory'), {
        ...newItem,
        quantity: newItem.quantity || 1, 
        dateAdded: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
      await fetchInventory(currentPage);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleUpdateItem = async (updatedItem) => {
    try {
      const itemRef = doc(db, 'inventory', updatedItem.id);
      await updateDoc(itemRef, {
        ...updatedItem,
        lastUpdated: serverTimestamp()
      });
      await fetchInventory(currentPage);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await deleteDoc(doc(db, 'inventory', itemId));
      await fetchInventory(currentPage);
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar 
          position="fixed" 
          sx={{ 
            zIndex: (theme) => theme.zIndex.drawer + 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Inventory Management System
            </Typography>
          </Toolbar>
        </AppBar>
        <Sidebar 
          mobileOpen={mobileOpen} 
          handleDrawerToggle={handleDrawerToggle}
          setCurrentView={setCurrentView}
          currentView={currentView}
          drawerWidth={drawerWidth}
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            mt: ['48px', '56px', '64px'],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            maxWidth: '1200px',
            mx: 'auto',
            px: { xs: 2, sm: 3, md: 4 },
            '& > *': {
              ml: { sm: -2, md: -3 },
            },
          }}
        >
          {currentView === 'inventory' && (
            <>
              <Box sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mr: 2, flexGrow: 1 }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    label="Sort By"
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="date">Date Added</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Inventory 
                inventory={inventory}
                categories={categories}
                updateItem={handleUpdateItem}
                deleteItem={handleDeleteItem}
                addItem={handleAddItem}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                isFirstPage={isFirstPage}
              />
            </>
          )}
          {currentView === 'categories' && (
  <Categories categories={categories} onCategorySelect={handleCategorySelect} />
)}

          {currentView === 'settings' && (
            <Settings darkMode={darkMode} setDarkMode={setDarkMode} />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}