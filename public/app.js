// public/app.js

document.addEventListener('DOMContentLoaded', () => {

  instructors = [
    {
      "name": "Aditi Shah",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/1cea90b5eb3f45c3b0b6559a1f5de5f4"
    },
    {
      "name": "Adrian Williams",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/c62abcd9ef694a3fb54b7c5b8a8cca91"
    },
    {
      "name": "Alex Karwoski",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/3f2723f9f323499ca944333617729fad"
    },
    {
      "name": "Alex Toussaint",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/c24c3f79806948af9cd7fc32ba17cf98"
    },
    {
      "name": "Ally Love",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/85182219e21c43b39aa1251dd8f12adb"
    },
    {
      "name": "Andy Speer",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/f2141244bb4048958bc74f2a45393333"
    },
    {
      "name": "Anna Greenberg",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/129eb1916178457fac5a39476a1211ce"
    },
    {
      "name": "Ash Pryor",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/9e84dd4f1cb64e8bb590756f38dea8c4"
    },
    {
      "name": "Assal Arian",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/22c05c2721d4483db8219cfd69ee160c"
    },
    {
      "name": "Becs Gentry",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/db02975670ca4f1998af3f18f7d8942b"
    },
    {
      "name": "Ben Alldis",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/6ad0758e32d04bc78c25d21fbfb70ee8"
    },
    {
      "name": "Benny Adami",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/fc10ae5c44c04465a5bc2cb50c1c59cf"
    },
    {
      "name": "Bradley Rose",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/58f56952d9d64b9d99a2bd2f99c5fb53"
    },
    {
      "name": "Callie Gullickson",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/001584f720a4442a89cce3a9aa4a7c5c"
    },
    {
      "name": "Camila Ramon",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/ab238fb5e5f248049798d667c08e2966"
    },
    {
      "name": "Charlotte Weidenbach",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/12cdc3693ea5453aa00ee58812caa07d"
    },
    {
      "name": "Chelsea Jackson Roberts",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/f401fd993aae42debd516f1a56bbde27"
    },
    {
      "name": "Christine DErcole",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/b34c4087a2fb41a48a17af8e76c37e89"
    },
    {
      "name": "Cliff Dwenger",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/caa1e6d98c3845c1835e44590504a658"
    },
    {
      "name": "Cody Rigsby",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/b7e2b0d47d714c38ba886ff279204e5f"
    },
    {
      "name": "Denis Morton",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/bd0f52a6f6b141c497a3c0c40b4c9697"
    },
    {
      "name": "Emma Lovewell",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/07cd6ac5d85e4ad5972c1a084c34a69e"
    },
    {
      "name": "Erik Jager",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/9f3390f75ddd4c68a68361de6a80c2b9"
    },
    {
      "name": "Hannah Corbin",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/748d6003af3e4258aafb678eec827f80"
    },
    {
      "name": "Hannah Frankson",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/3f3b59c78faa42d78c66aa826486e91c"
    },
    {
      "name": "Jeffrey McEachern",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/6af1216fbeaf482e842e7c756c648a29"
    },
    {
      "name": "Jenn Sherman",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/590db673e820451c92dadb1f7841fd84"
    },
    {
      "name": "Jermaine Johnson",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/e778cc5377da42248055f39c6f1f64ac"
    },
    {
      "name": "Jess King",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/648d465edcae4c399f7c60fb14225bbe"
    },
    {
      "name": "Jess Sims",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/69fb2cff72054bb6b7b340eccb7a673c"
    },
    {
      "name": "Jon Hosking",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/3cc8ec04873a4129b29b547171b5e28c"
    },
    {
      "name": "Joslyn Thompson Rule",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/3aab70084465407cbb99d2e5c1e935ac"
    },
    {
      "name": "Katie Wang",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/109809e7cb274b7d907f9a2d4dbba8a8"
    },
    {
      "name": "Kendall Toole",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/6146a86a57b0436a925ee6471476f801"
    },
    {
      "name": "Kirra Michel",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/ad0fb13263db404297fb854f2e3258a9"
    },
    {
      "name": "Kirsten Ferguson",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/aa3ddcca8dfd4743b771d1c036d30aec"
    },
    {
      "name": "Kristin McGee",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/1b48d7769cbb4b0388cd53d96aff5ed1"
    },
    {
      "name": "Leanne Hainsby",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/2040db9e5f734e5d859f740a9703ac5b"
    },
    {
      "name": "Logan Aldridge",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/7b07b715d3a14782be34d1252ec8af18"
    },
    {
      "name": "Marcel Dinkins",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/58547557d4e2489eb69573c10dc166d3"
    },
    {
      "name": "Marcel Maurer",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/a91ec58926b74942b435a55b41691ba9"
    },
    {
      "name": "Mariana Fernandez",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/414b737622034473b49506fda23eed14"
    },
    {
      "name": "Matty Maggiacomo",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/609151a1bbfb4ff390bbf0ef5c6aa126"
    },
    {
      "name": "Matt Wilpers",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/b6a731695161478d98de5d465211e1bd"
    },
    {
      "name": "Mayla Wedekind",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/6576a037a6f44f82919bbe2952d17810"
    },
    {
      "name": "Mila Lazar",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/aadf0b00343146c982462b8720ec95a8"
    },
    {
      "name": "Nico Sarani",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/74a1013b730e45c8804678a47d380831"
    },
    {
      "name": "Olivia Amato",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/99e7c78745c64d209d7c63d7ad52269b"
    },
    {
      "name": "Rad Lopez",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/688cce3ea95e473690d4b0e05c2cf509"
    },
    {
      "name": "Rebecca Kennedy",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/e8bd3100a6ac445d8a5a20b6302d8f5b"
    },
    {
      "name": "Robin Arzon",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/4f14e005ca914ab68b313c3f752b3574"
    },
    {
      "name": "Ross Rayburn",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/439ff582e330493497807af8a7f156a0"
    },
    {
      "name": "Sam Yo",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/1254d0ec147d4c3a8b410fc51156b4de"
    },
    {
      "name": "Selena Samuela",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/7fc4f639bc634704b924b528c1b76028"
    },
    {
      "name": "Susie Chan",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/6af4718b0bc243e59a709e71b9279769"
    },
    {
      "name": "Tobias Heinze",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/c51271e63b934faeb139cd39b750cb53"
    },
    {
      "name": "Tunde Oyeneyin",
      "image_url": "https://s3.amazonaws.com/workout-metric-images-prod/d13ced311d4347598a7009edd6197649"
    },
    {
      "name": "Christian Vande Velde",
      "image_url": "https://workout-metric-images-prod.s3.amazonaws.com/e92a4616ae3f4ee3837a710facd34369"
    }
  ]

  // Extract View Query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const viewParam = urlParams.get('view') || 'all';

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

  let receivedData;

  // Hashmap of current filters
  let currentFilters = {
    instructor: '',
    music: '',
    exercise: '',
    duration: '',
    type: ''
  };
  
  // Initialize the application
  function init() {
    loadContent(currentPath);
    setupWebSocket();
    setupEventListeners();
  }
  
  // Format date for display
  function formatDate(dateString) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6) - 1; // Months are zero-indexed in JavaScript
    const day = dateString.substring(6, 8);
    const date = new Date(year, month, day);
    
    // Format the date to "Oct 9, 2021"
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
  }
  
  // Format file size
  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
  
  function filterVideosBySelections(e)
  {
    const selectedValue = e.target.value;
    if (e.target.id == "instructor-filter") {
      currentFilters.instructor = selectedValue;
    }
    if (e.target.id == "music-filter") {
      currentFilters.music = selectedValue;
    }
    if (e.target.id == "exercise-filter") {
      currentFilters.exercise = selectedValue;
    }
    if (e.target.id == "duration-filter") {
      currentFilters.duration = selectedValue;
    }
    if (e.target.id == "type-filter") {
      currentFilters.type = selectedValue;
    }

    console.log(currentFilters);


    let filteredVideos = receivedData.videos;

    if (currentFilters.exercise !== '') {
      filteredVideos = filteredVideos.filter(video => video.exercise === currentFilters.exercise);
    }

    if (currentFilters.duration !== '') {
      filteredVideos = filteredVideos.filter(video => video.duration === currentFilters.duration);
    }

    if (currentFilters.type !== '') {
      filteredVideos = filteredVideos.filter(video => video.type === currentFilters.type);
    }

    if (currentFilters.instructor !== '') {
      filteredVideos = filteredVideos.filter(video => video.instructor === currentFilters.instructor);
    }

    if (currentFilters.music !== '') {
      filteredVideos = filteredVideos.filter(video => video.music === currentFilters.music);
    }

    // Clear content grid and re-create video thumbnails
    contentGrid.innerHTML = '';
    filteredVideos.forEach(video => {
      createVideoThumbnail(video);
    });
  }

  function createDropdownFilter(options, id, label, onChangeHandler) {
    const dropdownFilter = document.createElement('select');
    
    // Sort options alphabetically and sort numbers by value
    if (label === "Durations") {
      options.sort((a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        return numA - numB;
      }
      );
    } 
    else {
      options.sort((a, b) => a.localeCompare(b));
    }

    dropdownFilter.id = id;
    dropdownFilter.innerHTML = `
      <option value="">All ${label}</option>
      ${options.map(option => `<option value="${option}">${option}</option>`).join('')}
    `;
    dropdownFilter.style.marginBottom = '10px';
    dropdownFilter.style.marginRight = '10px';
    dropdownFilter.addEventListener('change', onChangeHandler);
    contentGrid.parentElement.insertBefore(dropdownFilter, contentGrid);
  }

  // Load content (folders and videos) from the server
  function loadContent(path) {
    showLoading();
    currentPath = path;
    updateBreadcrumb(path);

    contentURL = "/api/browse/";
    if (viewParam === "latest") {
      contentURL = '/api/getLatestVideos';
    } else if (viewParam === "popular") {
      contentURL = `/api/getPopularVideos`;
    }
    
    fetch(contentURL)
      .then(response => response.json())
      .then(data => {
        receivedData = data;
        contentGrid.innerHTML = '';
        
        // No content case
        if (data.folders.length === 0 && data.videos.length === 0) {
          showEmptyState();
          return;
        }
        const exercises = [...new Set(data.videos.map(video => video.exercise))];
        createDropdownFilter(exercises, 'exercise-filter', 'Exercises', filterVideosBySelections);
        
        const durations = [...new Set(data.videos.map(video => video.duration))];
        createDropdownFilter(durations, 'duration-filter', 'Durations', filterVideosBySelections);

        const types = [...new Set(data.videos.map(video => video.type))];
        createDropdownFilter(types, 'type-filter', 'Types', filterVideosBySelections);

        const instructors = [...new Set(data.videos.map(video => video.instructor))];
        createDropdownFilter(instructors, 'instructor-filter', 'Instructors', filterVideosBySelections);
        
        const music = [...new Set(data.videos.map(video => video.music))];
        createDropdownFilter(music, 'music-filter', 'Music', filterVideosBySelections);

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
    
    const match = instructors.find(i => i.name === video.instructor);
    if (match) {
      thumbnail.style.backgroundImage = `url(${match.image_url})`;
      thumbnail.style.backgroundSize = 'cover';
      thumbnail.style.backgroundPosition = 'center';
      thumbnail.style.backgroundRepeat = 'no-repeat';

      // add 80px tall thumbnail box
      thumbnail.style.height = '260px';
      thumbnail.innerHTML = `
        `;
    }
    else {
      thumbnail.innerHTML = `
        <div class="thumbnail-img">
          <i class="fas fa-play-circle"></i>
        </div>
      `;
    }
    // Add info panel at the bottom of thumbnail with white background

    const infoPanel = document.createElement('div');
    infoPanel.className = 'info-panel';

    infoPanel.innerHTML = `
      <div class="video-title">${video.title}</div>
      <div class="video-meta">
        <span class="video-instructor">${video.instructor}</span><br/>
        ${formatDate(video.date)} •
        ${video.music}
      </div>
      `;

    // Add exercise as a small vertical badge to top left corner of thumbnail
    const exerciseBadge = document.createElement('div');
    exerciseBadge.className = 'exercise-badge';
    exerciseBadge.textContent = `${video.exercise}`;
    thumbnail.appendChild(exerciseBadge);


    // Add duration as a small badge to top right corner of thumbnail
    const durationBadge = document.createElement('div');
    durationBadge.className = 'duration-badge';
    durationBadge.textContent = `${video.duration}m`;
    thumbnail.appendChild(durationBadge);

    // Add type as a small badge to bottom right corner of thumbnail
    const typeBadge = document.createElement('div');
    typeBadge.className = 'type-badge';
    typeBadge.textContent = `${video.type}`;
    thumbnail.appendChild(typeBadge);
    
    thumbnail.appendChild(infoPanel);

    // Add double-click event
    thumbnail.addEventListener('dblclick', () => {
      playVideo(video.path);
    });

    infoPanel.addEventListener('dblclick', () => {
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
