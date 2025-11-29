# Where to Run npm install

## ✅ EASIEST WAY (Recommended)

**Run from the ROOT directory** (`g:\testLinkedIn`):

```bash
npm run install-all
```

This single command will:
1. Install root dependencies (concurrently)
2. Install server dependencies
3. Install client dependencies

## 📁 Manual Installation (Alternative)

If you prefer to install manually, run these commands **in order**:

### Step 1: Root Directory
```bash
# Make sure you're in: g:\testLinkedIn
npm install
```

### Step 2: Server Directory
```bash
# Navigate to server folder
cd server
npm install
cd ..
```

### Step 3: Client Directory
```bash
# Navigate to client folder
cd client
npm install
cd ..
```

## 🎯 Quick Summary

**Location**: Run from `g:\testLinkedIn` (root folder)

**Command**: 
```bash
npm run install-all
```

That's it! This will install all dependencies for the entire project.

## ✅ Verify Installation

After running `npm run install-all`, you should see:
- ✅ `node_modules` folder in root directory
- ✅ `node_modules` folder in `server` directory  
- ✅ `node_modules` folder in `client` directory

## 🚀 Next Steps

After installation:
1. Configure database in `server/.env`
2. Run `npm run dev` to start the application

