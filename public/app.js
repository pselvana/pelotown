// public/app.js
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const galleryView = document.getElementById('gallery-view');
  const playerView = document.getElementById('player-view');
  const contentGrid = document.getElementById('content-grid');
  const videoPlayer = document.getElementById('video-player');
  const closeVideoBtn = document.getElementById('close-video');
  const cadenceValue = document.getElementById('cadence-value');
  const resistanceValue = document.getElementById('resistance-value');
  const powerValue = document.getElementById('power-value');
  const speedValue = document.getElementById('speed-value');
  const breadcrumb = document.getElementById('breadcrumb');

  let lastCadence = 0;
  let lastResistance = 0;
  
  // Current directory path (relative to videos folder)
  let currentPath = '';
  
  // Websocket connection
  let ws;
  
  // Initialize the application
  function init() {
    loadContent(currentPath);
    setupWebSocket();
    setupEventListeners();
  }
  
  // Format date for display
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
  
  // Load content (folders and videos) from the server
  function loadContent(path) {
    showLoading();
    currentPath = path;
    updateBreadcrumb(path);
    
    fetch(`/api/browse/${path}`)
      .then(response => response.json())
      .then(data => {
        contentGrid.innerHTML = '';
        
        // No content case
        if (data.folders.length === 0 && data.videos.length === 0) {
          showEmptyState();
          return;
        }
        
        // Create folder items
        data.folders.forEach(folder => {
          createFolderItem(folder);
        });
        
        // Create video thumbnails
        data.videos.forEach(video => {
          createVideoThumbnail(video);
        });
      })
      .catch(error => {
        console.error('Error loading content:', error);
        contentGrid.innerHTML = `
          <div class="empty-gallery">
            <i class="fas fa-exclamation-circle"></i>
            <p>Error loading content. Please try again later.</p>
          </div>
        `;
      });
  }
  
  // Update breadcrumb navigation
  function updateBreadcrumb(path) {
    // Clear all except Home
    while (breadcrumb.children.length > 1) {
      breadcrumb.removeChild(breadcrumb.lastChild);
    }
    
    if (path === '') return;
    
    // Split path into segments
    const segments = path.split('/');
    let currentSegmentPath = '';
    
    segments.forEach((segment, index) => {
      currentSegmentPath += (index > 0 ? '/' : '') + segment;
      
      const li = document.createElement('li');
      const a = document.createElement('a');
      
      a.href = '#';
      a.textContent = segment;
      a.dataset.path = currentSegmentPath;
      
      a.addEventListener('click', (e) => {
        e.preventDefault();
        loadContent(e.target.dataset.path);
      });
      
      li.appendChild(a);
      breadcrumb.appendChild(li);
    });
  }
  
  // Show loading state
  function showLoading() {
    contentGrid.innerHTML = `
      <div class="loading">
        <i class="fas fa-spinner"></i>
      </div>
    `;
  }
  
  // Show empty state
  function showEmptyState() {
    // Get parent path
    const parentPath = currentPath.split('/').slice(0, -1).join('/');
    
    contentGrid.innerHTML = `
      <div class="empty-gallery">
        <i class="fas fa-folder-open"></i>
        <p>No videos or folders found in this directory.</p>
        ${currentPath ? `
          <a href="#" class="back-button" data-path="${parentPath}">
            <i class="fas fa-arrow-left"></i> Back to parent folder
          </a>
        ` : `
          <p>Add MP4 files or folders to the videos directory to get started.</p>
        `}
      </div>
    `;
    
    // Add event listener to back button if present
    const backBtn = contentGrid.querySelector('.back-button');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loadContent(e.target.dataset.path || parentPath);
      });
    }
  }
  
  // Create folder item
  function createFolderItem(folder) {
    const folderElement = document.createElement('div');
    folderElement.className = 'folder-item';
    folderElement.dataset.path = folder.path;
    
    folderElement.innerHTML = `
      <div class="folder-icon">
        <i class="fas fa-folder"></i>
      </div>
      <div class="folder-info">
        <div class="folder-name">${folder.name}</div>
      </div>
    `;
    
    // Add click event
    folderElement.addEventListener('click', () => {
      loadContent(folder.path);
    });
    
    contentGrid.appendChild(folderElement);
  }
  
  // Create thumbnail for video
  function createVideoThumbnail(video) {
    const thumbnail = document.createElement('div');
    thumbnail.className = 'video-thumbnail';
    thumbnail.dataset.videoPath = video.path;
    
    thumbnail.innerHTML = `
      <div class="thumbnail-img">
        <i class="fas fa-play-circle"></i>
      </div>
      <div class="video-info">
        <div class="video-title">${video.name}</div>
        <div class="video-meta">
          ${formatFileSize(video.size)} • ${formatDate(video.modified)}
        </div>
      </div>
    `;
    
    // Add double-click event
    thumbnail.addEventListener('dblclick', () => {
      playVideo(video.path);
    });
    
    contentGrid.appendChild(thumbnail);
  }
  
  // Play a video
  function playVideo(videoPath) {
    videoPlayer.src = `/videos/${videoPath}`;
    videoPlayer.load();
    
    galleryView.classList.add('hidden');
    playerView.classList.remove('hidden');
    
    // Play when ready
    videoPlayer.oncanplay = () => {
      videoPlayer.play();
    };
  }
  
  // Setup WebSocket connection
  function setupWebSocket() {
    // Use secure WebSocket if on HTTPS
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('Connected to server');
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        updateMetrics(data);
      } catch (e) {
        console.error('Error parsing WebSocket message:', e);
      }
    };
    
    ws.onclose = () => {
      console.log('Disconnected from server');
      // Try to reconnect after a delay
      setTimeout(setupWebSocket, 3000);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
  
  // Update metrics display
  function updateMetrics(data) {
    if ('cadence' in data) {
      cadenceValue.textContent = Math.round(data.cadence);
      lastCadence = data.cadence;
    }
    
    if ('resistance' in data) {
      resistanceValue.textContent = Math.round(data.resistance);
      lastResistance = data.resistance;
    }

    // REVISIT
    // Power (in watts) = (Resistance % × Cadence²) ÷ a constant (30 for peloton).
    powerValue.textContent = (Math.round((lastResistance * Math.pow(lastCadence, 2)) / 30));

    // convert meters per second to km/h
    speedValue.textContent = (Math.round(lastResistance * 30 * 3.6));
  }
  
  // Setup event listeners
  function setupEventListeners() {
    // Home breadcrumb link
    const homeLink = breadcrumb.querySelector('a[data-path=""]');
    homeLink.addEventListener('click', (e) => {
      e.preventDefault();
      loadContent('');
    });
    
    // Close video button
    closeVideoBtn.addEventListener('click', () => {
      videoPlayer.pause();
      videoPlayer.src = '';
      
      playerView.classList.add('hidden');
      galleryView.classList.remove('hidden');
    });
    
    // Handle Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !playerView.classList.contains('hidden')) {
        closeVideoBtn.click();
      }
    });
  }
  
  // Initialize
  init();
});
