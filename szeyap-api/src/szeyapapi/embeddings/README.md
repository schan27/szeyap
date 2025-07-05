# Szeyap Embeddings Setup Guide

This directory contains the Jupyter notebook for creating and working with embeddings for the Szeyap dictionary project. This guide will walk you through setting up the required conda environment to run the notebook.

## Prerequisites

Before you begin, you'll need to have conda installed on your system.

## Installing Conda

### Option 1: Miniconda (Recommended)

Miniconda is a minimal installer for conda that includes only conda, Python, and a small number of useful packages.

#### macOS
```bash
# Download and install Miniconda for macOS
curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-MacOSX-arm64.sh
bash Miniconda3-latest-MacOSX-arm64.sh
```

#### Linux
```bash
# Download and install Miniconda for Linux
curl -O https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
```

#### Windows
Download the installer from [https://docs.conda.io/en/latest/miniconda.html](https://docs.conda.io/en/latest/miniconda.html) and run it.

### Option 2: Anaconda (Full Distribution)

If you prefer the full Anaconda distribution with pre-installed packages, download it from [https://www.anaconda.com/download](https://www.anaconda.com/download).

### Verify Installation

After installation, restart your terminal and verify conda is working:

```bash
conda --version
```

## Setting Up the Environment

### 1. Navigate to the Embeddings Directory

```bash
cd /path/to/szeyap/szeyap-api/src/szeyapapi/embeddings
```

### 2. Create the Conda Environment

Use the provided `environment.yml` file to create the conda environment with all required dependencies:

```bash
conda env create -f environment.yml
```

This will create a new conda environment named `szeyap-env` with:
- **Python 3.11.5**
- **Jupyter ecosystem** (ipykernel, ipython, jupyter_client, etc.)
- **Machine Learning libraries**:
  - PyTorch (with MPS support for Apple Silicon)
  - Hugging Face Transformers
  - Sentence Transformers
  - LangChain and LangChain Hugging Face
  - FAISS for vector storage
  - Scikit-learn, NumPy, Pandas
- **Development tools**: tqdm for progress bars, pydantic for data validation

### 3. Activate the Environment

```bash
conda activate szeyap-env
```

You should see `(szeyap-env)` at the beginning of your terminal prompt, indicating the environment is active.

### 4. Verify Installation

Check that key packages are installed correctly:

```bash
# Check Python version
python --version

# Check if PyTorch can detect MPS (for Apple Silicon Macs)
python -c "import torch; print(f'MPS available: {torch.backends.mps.is_available()}')"

# Check LangChain installation
python -c "import langchain; print(f'LangChain version: {langchain.__version__}')"

# Check FAISS installation
python -c "import faiss; print('FAISS installed successfully')"
```

## Running the Jupyter Notebook

### 1. Start Jupyter

With the environment activated, start Jupyter:

```bash
jupyter notebook
```

or if you prefer JupyterLab:

```bash
jupyter lab
```

### 2. Open the Notebook

Navigate to and open `szeyap_embeddings.ipynb` in the Jupyter interface.

### 3. Verify GPU Support (Optional)

The first cell in the notebook checks for GPU availability. Run it to verify:
- **CUDA**: For NVIDIA GPUs
- **MPS**: For Apple Silicon Macs (M1/M2/M3)
- **CPU**: Fallback if no GPU is available

## Using Jupyter Notebooks in VS Code (Recommended)

VS Code provides excellent built-in support for Jupyter notebooks with a rich editing experience, IntelliSense, debugging capabilities, and seamless integration with your development workflow.

### Prerequisites for VS Code

1. **Install VS Code**: Download from [https://code.visualstudio.com/](https://code.visualstudio.com/)

2. **Install Required Extensions**:
   - **Python Extension**: Essential for Python support
   - **Jupyter Extension**: Usually bundled with Python extension
   
   Install via Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux):
   ```
   ext install ms-python.python
   ```

### Setting Up VS Code for Jupyter

1. **Open the Project in VS Code**:
   ```bash
   cd /path/to/szeyap/szeyap-api/src/szeyapapi/embeddings
   code .
   ```

2. **Activate Your Environment**:
   - Open Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`)
   - Type "Python: Select Interpreter"
   - Choose the `szeyap-env` environment (should show the path like `/opt/miniconda3/envs/szeyap-env/bin/python`)

3. **Open the Notebook**:
   - Click on `szeyap_embeddings.ipynb` in the Explorer
   - VS Code will automatically detect it as a Jupyter notebook

4. **Select Kernel**:
   - Click the kernel picker in the top-right of the notebook
   - Select the `szeyap-env` environment
   - You should see "Python 3.11.5" with the environment path

### Working with Notebooks in VS Code

#### Running Cells
- **Single Cell**: Click the ▶️ button to the left of a cell or use `Ctrl+Enter`
- **Run and Advance**: `Shift+Enter` runs current cell and moves to next
- **Run and Insert**: `Alt+Enter` runs current cell and creates new cell below
- **Run All**: Use the double arrow `⏩` in the main toolbar

#### Cell Management
- **Add Cell Above**: `A` (in command mode)
- **Add Cell Below**: `B` (in command mode)
- **Delete Cell**: `dd` (in command mode)
- **Change to Markdown**: `M` (in command mode)
- **Change to Code**: `Y` (in command mode)
- **Undo**: `Z` (in command mode)

#### Navigation and Editing
- **Command Mode**: Press `Esc` (blue left border)
- **Edit Mode**: Press `Enter` (green left border)
- **Navigate Cells**: Use arrow keys in command mode or `J`/`K`
- **Toggle Line Numbers**: `L` for single cell, `Shift+L` for entire notebook

#### Advanced Features

**Variable Explorer**:
- Click the "Variables" button in the toolbar after running cells
- Inspect variable values, types, and shapes
- Double-click variables to open in Data Viewer

**IntelliSense and Autocomplete**:
- Full Python IntelliSense support
- Code completion with `Tab`
- Parameter hints and documentation
- Import suggestions

**Debugging**:
- Set breakpoints by clicking in the left margin
- Use "Debug Cell" button next to "Run Cell"
- Step through code with full VS Code debugger
- Use "Run by Line" for simpler line-by-line execution

**Search and Navigation**:
- `Cmd+F` / `Ctrl+F` to search within notebook
- Filter search by cell type (code, markdown, output)
- Use Outline view for navigation (Explorer sidebar)

### VS Code Specific Benefits

1. **Integrated Terminal**: Switch between notebook and terminal seamlessly
2. **Git Integration**: See changes, commit, and manage version control
3. **Extension Ecosystem**: Access to thousands of extensions
4. **Multi-file Editing**: Edit related Python files alongside the notebook
5. **Workspace Settings**: Consistent settings across your project
6. **Remote Development**: Connect to remote servers or containers

### Workspace Trust

When opening the notebook for the first time, VS Code may ask about workspace trust. For this project:
- Click "Trust" to enable full functionality
- This allows code execution and rich outputs
- Required for proper Jupyter notebook operation

### Performance Tips

1. **Use Outline View**: Navigate large notebooks efficiently
2. **Collapse Outputs**: Right-click outputs to collapse them
3. **Clear Outputs**: Use "Clear All Outputs" when outputs become large
4. **Restart Kernel**: If memory usage gets high, restart the kernel
5. **Variable Cleanup**: Use `del variable_name` to free memory

### Keyboard Shortcuts Summary

| Action | Shortcut |
|--------|----------|
| Run cell | `Ctrl+Enter` |
| Run cell and advance | `Shift+Enter` |
| Run cell and insert below | `Alt+Enter` |
| Add cell above | `A` (command mode) |
| Add cell below | `B` (command mode) |
| Delete cell | `dd` (command mode) |
| Change to markdown | `M` (command mode) |
| Change to code | `Y` (command mode) |
| Enter edit mode | `Enter` |
| Enter command mode | `Esc` |
| Toggle line numbers | `L` (command mode) |
| Search | `Cmd+F` / `Ctrl+F` |

### Troubleshooting VS Code Jupyter

1. **Kernel Not Found**:
   - Ensure the conda environment is selected as Python interpreter
   - Restart VS Code and reselect the interpreter

2. **Import Errors**:
   - Verify the correct kernel is selected
   - Check that packages are installed in the `szeyap-env` environment

3. **Performance Issues**:
   - Clear outputs regularly
   - Restart kernel if memory usage is high
   - Close unused notebooks

4. **Extension Issues**:
   - Update Python and Jupyter extensions
   - Reload VS Code window (`Cmd+R` / `Ctrl+R`)

## Environment Management

### Updating the Environment

If you need to add new packages:

```bash
# Install via conda (preferred)
conda install -n szeyap-env package_name

# Or install via pip
conda activate szeyap-env
pip install package_name
```

### Exporting Environment Changes

If you add new packages and want to update the environment.yml file:

```bash
conda activate szeyap-env
conda env export > environment.yml
```

### Removing the Environment

If you need to start fresh:

```bash
conda env remove -n szeyap-env
```

### Deactivating the Environment

When you're done working:

```bash
conda deactivate
```

## Troubleshooting

### Common Issues

1. **"conda: command not found"**
   - Restart your terminal after installing conda
   - Or run: `source ~/.bashrc` (Linux) or `source ~/.zshrc` (macOS)

2. **Environment creation fails**
   - Make sure you're in the correct directory with `environment.yml`
   - Try: `conda clean --all` to clear conda cache

3. **Jupyter kernel not found**
   - Make sure the environment is activated when starting Jupyter
   - Install ipykernel: `conda install ipykernel`

4. **MPS/CUDA not working**
   - For MPS (Apple Silicon): Ensure you have macOS 12.3+ and PyTorch with MPS support
   - For CUDA: Ensure you have compatible NVIDIA drivers and CUDA toolkit

### Getting Help

- Check conda documentation: [https://docs.conda.io/](https://docs.conda.io/)
- Jupyter documentation: [https://jupyter.readthedocs.io/](https://jupyter.readthedocs.io/)
- For project-specific issues, check the main Szeyap repository documentation

## What's in the Notebook

The `szeyap_embeddings.ipynb` notebook contains:

1. **Device Detection**: Automatically detects and configures GPU/MPS support
2. **Data Loading**: Loads Szeyap dictionary data from JSON files
3. **Document Processing**: Creates structured documents for embedding
4. **Embedding Generation**: Uses Hugging Face sentence transformers to create embeddings
5. **Vector Storage**: Stores embeddings in FAISS for efficient similarity search
6. **Search Testing**: Demonstrates similarity search functionality

The notebook is designed to work with both Gene Chin and Stephen Li dictionary datasets, and automatically optimizes for available hardware (GPU/MPS/CPU).
