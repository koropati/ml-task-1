document.addEventListener('DOMContentLoaded', function () {
    // Get all sections
    const sections = document.querySelectorAll('.section');
    const totalSections = sections.length;

    // Print button
    const printButton = document.getElementById('print-button');

    // Language toggle
    const languageButton = document.getElementById('language-button');

    // Fullscreen button
    const fullscreenButton = document.getElementById('fullscreen-button');

    // Drawer elements
    const drawerToggle = document.getElementById('drawer-toggle');
    const sideDrawer = document.getElementById('side-drawer');
    const closeDrawer = document.getElementById('close-drawer');
    const tocList = document.getElementById('toc-list');

    // Current language (default: English)
    let currentLanguage = 'en';

    // Create section navigation
    const sectionNav = document.getElementById('section-nav');

    sections.forEach((section, index) => {
        const button = document.createElement('div');
        button.className = 'section-button';
        button.textContent = index + 1;
        button.dataset.section = index + 1;

        if (index === 0) {
            button.classList.add('active');
        }

        button.addEventListener('click', () => {
            goToSection(index + 1);
        });

        sectionNav.appendChild(button);
    });

    // Populate Table of Contents
    populateTableOfContents();

    // Initialize drawer toggle event
    initializeDrawer();

    // Initialize fullscreen button
    initializeFullscreen();

    // Helper function to populate the table of contents
    function populateTableOfContents() {
        sections.forEach((section, index) => {
            const sectionNumber = index + 1;
            
            // Find the main heading in each section
            let titleElement = section.querySelector('h1');
            let titleText = titleElement ? titleElement.textContent : `Section ${sectionNumber}`;
            
            // Create the TOC item
            const tocItem = document.createElement('div');
            tocItem.className = 'toc-item';
            tocItem.dataset.section = sectionNumber;
            
            if (index === 0) {
                tocItem.classList.add('active');
            }
            
            tocItem.innerHTML = `
                <div class="flex items-center">
                    <span class="w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-700 rounded-full">
                        ${sectionNumber}
                    </span>
                    <span class="toc-section-title">${titleText}</span>
                </div>
            `;
            
            tocItem.addEventListener('click', () => {
                goToSection(sectionNumber);
                closeDrawerFunction();
            });
            
            tocList.appendChild(tocItem);
        });
    }

    // Initialize drawer functionality
    function initializeDrawer() {
        // Toggle drawer on button click
        drawerToggle.addEventListener('click', () => {
            sideDrawer.classList.toggle('open');
            drawerToggle.classList.toggle('open');
            
            // Toggle icon direction
            const icon = drawerToggle.querySelector('i');
            if (sideDrawer.classList.contains('open')) {
                icon.className = 'fas fa-chevron-right';
            } else {
                icon.className = 'fas fa-chevron-left';
            }
        });
        
        // Close drawer on close button click
        closeDrawer.addEventListener('click', closeDrawerFunction);
        
        // Close drawer when clicking outside of it
        document.addEventListener('click', (e) => {
            if (!sideDrawer.contains(e.target) && 
                !drawerToggle.contains(e.target) && 
                sideDrawer.classList.contains('open')) {
                closeDrawerFunction();
            }
        });
    }
    
    // Close drawer function
    function closeDrawerFunction() {
        sideDrawer.classList.remove('open');
        drawerToggle.classList.remove('open');
        drawerToggle.querySelector('i').className = 'fas fa-chevron-left';
    }

    // Initialize fullscreen functionality
    function initializeFullscreen() {
        fullscreenButton.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                // Enter fullscreen
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                }
                fullscreenButton.innerHTML = '<i class="fas fa-compress mr-2"></i> Exit Fullscreen';
            } else {
                // Exit fullscreen
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                fullscreenButton.innerHTML = '<i class="fas fa-expand mr-2"></i> Fullscreen';
            }
        });
        
        // Update button text when fullscreen changes (e.g., by Esc key)
        document.addEventListener('fullscreenchange', updateFullscreenButtonText);
        document.addEventListener('webkitfullscreenchange', updateFullscreenButtonText);
        document.addEventListener('msfullscreenchange', updateFullscreenButtonText);
        
        function updateFullscreenButtonText() {
            if (document.fullscreenElement) {
                fullscreenButton.innerHTML = '<i class="fas fa-compress mr-2"></i> ' + 
                    (currentLanguage === 'en' ? 'Exit Fullscreen' : 'Keluar Layar Penuh');
            } else {
                fullscreenButton.innerHTML = '<i class="fas fa-expand mr-2"></i> ' + 
                    (currentLanguage === 'en' ? 'Fullscreen' : 'Layar Penuh');
            }
        }
    }

    // Helper functions
    function goToSection(sectionNumber) {
        window.location.hash = `section-${sectionNumber}`;
        updateActiveSection(sectionNumber);

        // Scroll to section
        const targetSection = document.getElementById(`section-${sectionNumber}`);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    function updateActiveSection(sectionNumber) {
        // Update legacy section buttons
        document.querySelectorAll('.section-button').forEach((button) => {
            if (parseInt(button.dataset.section) === parseInt(sectionNumber)) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update TOC items
        document.querySelectorAll('.toc-item').forEach((item) => {
            if (parseInt(item.dataset.section) === parseInt(sectionNumber)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // ===== PRINTING FUNCTIONALITY =====

    // Fungsi untuk mengukur dan menyesuaikan ukuran halaman berdasarkan konten tiap section
    function handleAdvancedPrinting() {
        // Simpan scroll position asli
        const originalScrollPos = window.scrollY;

        // Ukur semua section terlebih dahulu
        const sections = document.querySelectorAll('.section');
        const sectionMeasurements = [];

        // Ukur setiap section
        sections.forEach((section, index) => {
            // Clone section untuk pengukuran yang akurat
            const clonedSection = section.cloneNode(true);
            clonedSection.style.position = 'absolute';
            clonedSection.style.visibility = 'hidden';
            clonedSection.style.width = '21cm'; // Lebar A4
            clonedSection.style.height = 'auto';
            clonedSection.style.padding = '0.8cm';
            clonedSection.style.overflow = 'visible';
            document.body.appendChild(clonedSection);

            // Ukur tinggi
            const contentHeight = clonedSection.scrollHeight;
            sectionMeasurements.push({
                id: section.id,
                height: contentHeight,
                index: index
            });

            document.body.removeChild(clonedSection);
        });

        console.log("Section heights:", sectionMeasurements);

        // Buat CSS dinamis untuk setiap section
        let cssRules = `
            @page {
                size: 21cm 29.7cm; /* Default A4 */
                margin: 0;
            }
            @media print {
                body, html {
                    height: auto !important;
                    width: 100%;
                    margin: 0;
                    padding: 0;
                    background-color: white;
                }
                
                /* Base styling for all sections */
                .section {
                    position: relative;
                    page-break-after: always;
                    page-break-inside: avoid;
                    break-after: page;
                    box-sizing: border-box;
                    width: 100%;
                    overflow: hidden;
                    border: none;
                    display: flex !important;
                }
                
                /* Special styling for section 1 (cover) - centered content */
                #section-1 {
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 1.5cm;
                }
    
                /* Styling for all other sections - top-aligned content */
                .section:not(#section-1) {
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    padding-top: 0.8cm;
                }
                
                /* Styling untuk setiap section secara individual */
        `;

        let cssReducePaddingRule = `
        /* Reduce margins in tables and card elements */
                .p-4, .p-5, .p-6 {
                    padding: 0.5rem !important;
                }
                
                .py-2 {
                    padding-top: 0.3rem !important;
                    padding-bottom: 0.3rem !important;
                }
                
                .px-4 {
                    padding-left: 0.5rem !important;
                    padding-right: 0.5rem !important;
                }
                
                .mb-4, .mb-6, .mb-8 {
                    margin-bottom: 0.5rem !important;
                }
                
                .gap-6, .gap-8 {
                    gap: 0.75rem !important;
                }
                
        `

        // Tambahkan CSS untuk setiap section
        sectionMeasurements.forEach(secInfo => {
            // Tambahkan margin untuk keamanan
            const heightInCm = (secInfo.height + 20) / 37.8; // Konversi px ke cm dengan margin
            cssRules += `
                #${secInfo.id} {
                    height: ${secInfo.height + 20}px;
                    padding: 0.8cm;
                }
                
                #${secInfo.id}:not(#section-1) {
                    padding-top: 0.8cm;
                }
                
                @page :nth(${secInfo.index + 1}) {
                    size: 21cm ${heightInCm}cm;
                }
            `;
        });

        // Tambahkan styling lainnya
        cssRules += `
                .print-controls, .section-nav {
                    display: none !important;
                }
                
                /* Force backgrounds to print */
                .gradient-bg {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    color-adjust: exact;
                    background: linear-gradient(135deg, #667eea, #764ba2) !important;
                }
                
                table tr.bg-green-50 {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    color-adjust: exact;
                    background-color: #f0fdf4 !important;
                }
                
                table thead tr.bg-gray-100 {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    color-adjust: exact;
                    background-color: #f3f4f6 !important;
                }
                
                .bg-red-50, .bg-green-50, .bg-blue-50, .bg-yellow-50, .bg-indigo-50 {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    color-adjust: exact;
                }
        `;

        // Terapkan style untuk print
        const style = document.createElement('style');
        style.textContent = cssRules;
        document.head.appendChild(style);

        // Pesan untuk pengguna
        console.log("Mempersiapkan dokumen untuk print dengan ukuran halaman yang disesuaikan untuk setiap section...");

        // Trigger print dialog
        setTimeout(() => {
            window.print();

            // Hapus style setelah print
            setTimeout(() => {
                document.head.removeChild(style);
                // Kembalikan scroll position
                window.scrollTo(0, originalScrollPos);
                console.log("Print selesai, stylesheet dinamis dihapus");
            }, 100);
        }, 500);
    }

    // Alternatif: Solusi yang lebih sederhana - gunakan ukuran section terpanjang untuk semua halaman
    function handleSimplifiedPrinting() {
        // Simpan scroll position asli
        const originalScrollPos = window.scrollY;

        // Ukur semua section
        const sections = document.querySelectorAll('.section');
        let tallestSectionHeight = 0;
        let tallestSection = null;

        // Temukan section terpanjang
        sections.forEach((section) => {
            const clonedSection = section.cloneNode(true);
            clonedSection.style.position = 'absolute';
            clonedSection.style.visibility = 'hidden';
            clonedSection.style.width = '21cm'; // Lebar A4
            clonedSection.style.height = 'auto';
            clonedSection.style.padding = '0.8cm';
            clonedSection.style.overflow = 'visible';
            document.body.appendChild(clonedSection);

            const sectionHeight = clonedSection.scrollHeight;
            if (sectionHeight > tallestSectionHeight) {
                tallestSectionHeight = sectionHeight;
                tallestSection = section;
            }

            document.body.removeChild(clonedSection);
        });

        console.log(`Section terpanjang: ${tallestSection.id}, Tinggi: ${tallestSectionHeight}px`);

        // Tambahkan margin untuk keamanan
        const pageHeight = tallestSectionHeight + 20; // Tambahkan margin 20px

        // Set style untuk print
        const style = document.createElement('style');
        style.textContent = `
            @page {
                size: 21cm ${pageHeight / 37.8}cm; /* Konversi dari px ke cm untuk print */
                margin: 0;
            }
            @media print {
                body, html {
                    height: auto !important;
                    width: 100%;
                    margin: 0;
                    padding: 0;
                    background-color: white;
                }
                /* Base styling for all sections */
                .section {
                    position: relative;
                    page-break-after: always;
                    page-break-inside: avoid;
                    break-after: page;
                    box-sizing: border-box;
                    width: 100%;
                    height: ${pageHeight}px;
                    padding: 0.8cm;
                    overflow: hidden;
                    border: none;
                    display: flex !important;
                }
    
                /* Special styling for section 1 (cover) - centered content */
                #section-1 {
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 1.5cm;
                }
    
                /* Styling for all other sections - top-aligned content */
                .section:not(#section-1) {
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: flex-start;
                    padding-top: 0.8cm;
                }
                
                
                .print-controls, .section-nav {
                    display: none !important;
                }
                
                /* Force backgrounds to print */
                .gradient-bg {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    color-adjust: exact;
                    background: linear-gradient(135deg, #667eea, #764ba2) !important;
                }
                
                table tr.bg-green-50 {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    color-adjust: exact;
                    background-color: #f0fdf4 !important;
                }
                
                table thead tr.bg-gray-100 {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    color-adjust: exact;
                    background-color: #f3f4f6 !important;
                }
                
                .bg-red-50, .bg-green-50, .bg-blue-50, .bg-yellow-50, .bg-indigo-50 {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                    color-adjust: exact;
                }
            }
        `;
        document.head.appendChild(style);

        // Trigger print dialog
        setTimeout(() => {
            window.print();

            // Hapus style after printing
            setTimeout(() => {
                document.head.removeChild(style);
                // Kembalikan scroll position
                window.scrollTo(0, originalScrollPos);
            }, 100);
        }, 300);
    }

    // Fungsi untuk menambahkan tombol print alternatif
    function addPrintingOptions() {
        const printControls = document.querySelector('.print-controls');
        if (!printControls) return;

        // Modifikasi tombol print yang sudah ada
        const originalPrintButton = document.getElementById('print-button');
        if (originalPrintButton) {
            // Hapus event listener lama jika ada
            const newPrintButton = originalPrintButton.cloneNode(true);
            originalPrintButton.parentNode.replaceChild(newPrintButton, originalPrintButton);

            // Tambahkan event listener baru
            newPrintButton.addEventListener('click', handleSimplifiedPrinting);
            newPrintButton.innerHTML = `<i class="fas fa-print mr-2"></i> ${uiTranslations[currentLanguage]['exportToPdf']} (Standard)`;
        }

        // Tambahkan tombol print alternatif
        const advancedPrintButton = document.createElement('button');
        advancedPrintButton.className = 'print-button';
        advancedPrintButton.style.backgroundColor = '#9333ea'; // Ubah warna agar berbeda
        advancedPrintButton.innerHTML = `<i class="fas fa-file-pdf mr-2"></i> ${uiTranslations[currentLanguage]['exportToPdf']} (Advanced)`;
        advancedPrintButton.addEventListener('click', handleAdvancedPrinting);

        // Tambahkan tombol baru ke dalam print controls
        printControls.appendChild(advancedPrintButton);
    }

    // ===== LANGUAGE TOGGLE FUNCTIONALITY =====

    // Toggle language between English and Indonesian
    languageButton.addEventListener('click', function () {
        // Toggle language
        currentLanguage = currentLanguage === 'en' ? 'id' : 'en';

        // Update button text
        languageButton.innerHTML = `<i class="fas fa-language mr-2"></i> ${uiTranslations[currentLanguage]['languageToggle']}`;

        // Update UI elements
        updateUILanguage();

        // Update print buttons text
        updatePrintButtonsText();

        // Save language preference to localStorage
        localStorage.setItem('preferredLanguage', currentLanguage);
    });

    // Update print buttons text based on current language
    function updatePrintButtonsText() {
        const printBtn = document.getElementById('print-button');
        if (printBtn) {
            const currentText = printBtn.innerHTML;
            if (currentText.includes('Standard')) {
                printBtn.innerHTML = `<i class="fas fa-print mr-2"></i> ${uiTranslations[currentLanguage]['exportToPdf']} (Standard)`;
            }
        }

        // Update advanced button if exists
        const advancedButtons = document.querySelectorAll('.print-button');
        advancedButtons.forEach(btn => {
            if (btn.innerHTML.includes('Advanced')) {
                btn.innerHTML = `<i class="fas fa-file-pdf mr-2"></i> ${uiTranslations[currentLanguage]['exportToPdf']} (Advanced)`;
            }
        });
    }

    // Function to update UI language
    function updateUILanguage() {
        // Update static UI elements
        updateStaticUIElements();

        // Update all elements with data-en and data-id attributes
        document.querySelectorAll('[data-en][data-id]').forEach(element => {
            element.textContent = element.dataset[currentLanguage];
        });

        // Update elements using translations object
        updateAllSections();

        // Update fullscreen button text
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        if (isFullscreen) {
            fullscreenButton.innerHTML = '<i class="fas fa-compress mr-2"></i> ' + 
                (currentLanguage === 'en' ? 'Exit Fullscreen' : 'Keluar Layar Penuh');
        } else {
            fullscreenButton.innerHTML = '<i class="fas fa-expand mr-2"></i> ' + 
                (currentLanguage === 'en' ? 'Fullscreen' : 'Layar Penuh');
        }
        
        // Update drawer text
        const drawerTitle = document.querySelector('.drawer-header h3');
        if (drawerTitle) {
            drawerTitle.textContent = currentLanguage === 'en' ? 'Table of Contents' : 'Daftar Isi';
        }
    }

    // Update static UI elements
    function updateStaticUIElements() {
        // Update print button text
        updatePrintButtonsText();
    }

    // Better approach to update all sections
    function updateAllSections() {
        // Update section-specific content with more reliable selectors

        // Section 1: Cover
        updateElementBySelector('#section-1 h1', 'title');
        updateElementBySelector('#section-1 .mb-8.text-xl', 'paperSummary');
        updateElementsByTag('#section-1', 'h2.font-semibold.mb-2', ['authors', 'publishedIn', 'presentedBy']);
        updateElementByText('#section-1', 'p', '2023 IEEE', 'conference');
        updateElementBySelector('#section-1 .bg-white.bg-opacity-10.px-4.py-2.rounded-lg:nth-of-type(2) p', 'course');

        // Section 2: Outline
        updateElementBySelector('#section-2 h1', 'outlineTitle');
        updateElementByText('#section-2', 'h2', 'Introduction', 'intro');
        updateElementByText('#section-2', 'p', 'Problem statement', 'problemStatement');
        updateElementByText('#section-2', 'h2', 'Literature Review', 'litReview');
        updateElementByText('#section-2', 'p', 'Review of existing', 'reviewDescription');
        updateElementByText('#section-2', 'h2', 'Research Methods', 'methods');
        updateElementByText('#section-2', 'p', 'Gabor feature extraction', 'methodsDescription');
        updateElementByText('#section-2', 'h2', 'Results and Discussion', 'results');
        updateElementByText('#section-2', 'p', 'Experimental results', 'resultsDescription');
        updateElementByText('#section-2', 'h2', 'Conclusion', 'conclusion');
        updateElementByText('#section-2', 'p', 'Summary and suggestions', 'conclusionDescription');

        // Section 3: Introduction
        updateElementBySelector('#section-3 h1', 'introTitle');
        updateElementBySelector('#section-3 h2:first-of-type', 'background');
        updateElementsBySelector('#section-3 .md\\:w-1\\/2:first-of-type .list-disc li', [
            'backgroundPoint1', 'backgroundPoint2', 'backgroundPoint3'
        ]);
        updateElementBySelector('#section-3 h2:nth-of-type(2)', 'challenges');
        updateElementsBySelector('#section-3 .mt-6 .list-disc li', [
            'challengesPoint1', 'challengesPoint2', 'challengesPoint3'
        ]);
        updateElementBySelector('#section-3 .text-center.italic.text-gray-600', 'quote');
        updateElementBySelector('#section-3 h3.font-semibold.text-blue-700', 'whySAR');
        updateElementBySelector('#section-3 .bg-blue-50 p.text-gray-700', 'whySARDesc');

        // Section 4: Research Problem & Objectives
        updateElementBySelector('#section-4 h1', 'researchTitle');
        updateElementBySelector('#section-4 h2.font-semibold.text-red-700', 'problemTitle');
        updateElementsBySelector('#section-4 .bg-red-50 .list-disc li', [
            'problemPoint1', 'problemPoint2', 'problemPoint3'
        ]);
        updateElementBySelector('#section-4 h2.font-semibold.text-green-700', 'objectivesTitle');
        updateElementsBySelector('#section-4 .bg-green-50 .list-disc li', [
            'objectivesPoint1', 'objectivesPoint2', 'objectivesPoint3', 'objectivesPoint4'
        ]);
        updateElementBySelector('#section-4 h2.font-semibold.mb-4.text-center', 'approach');
        updateElementBySelector('#section-4 .flex.flex-col.md\\:flex-row.justify-around.items-center .text-center:nth-of-type(1) p.font-medium', 'gabor', true);
        updateElementBySelector('#section-4 .flex.flex-col.md\\:flex-row.justify-around.items-center .text-center:nth-of-type(2) p.font-medium', 'pca', true);
        updateElementBySelector('#section-4 .flex.flex-col.md\\:flex-row.justify-around.items-center .text-center:nth-of-type(3) p.font-medium', 'knn', true);

        // Section 5: Literature Review
        updateElementBySelector('#section-5 h1', 'litReviewTitle');
        updateElementBySelector('#section-5 h2:first-of-type', 'tradApproaches');
        updateElementByIndex('#section-5', 'th', 0, 'authors');
        updateElementByIndex('#section-5', 'th', 1, 'method');
        updateElementByIndex('#section-5', 'th', 2, 'keyFeatures');

        // Search for table cells by content
        updateTableCellByContent('#section-5', 'Conditional Random Fields', 'crf');
        updateTableCellByContent('#section-5', 'Multi-scale region', 'crfDesc');
        updateTableCellByContent('#section-5', 'Saliency Attention', 'sift');
        updateTableCellByContent('#section-5', 'Combines visual', 'siftDesc');
        updateTableCellByContent('#section-5', 'Polar scale-invariant', 'psiftDesc');
        updateTableCellByContent('#section-5', 'Bag-of-Words', 'bow');
        updateTableCellByContent('#section-5', 'Based on clonal', 'bowDesc');

        updateElementBySelector('#section-5 h3.font-semibold.text-yellow-700', 'tradLimits');
        updateElementBySelector('#section-5 .bg-yellow-50 p.text-gray-700', 'tradLimitsDesc');

        // Section 6: Literature Review (Cont.)
        updateElementBySelector('#section-6 h1', 'litReviewTitle');
        updateElementBySelector('#section-6 h2:first-of-type', 'deepLearningApproaches');
        updateElementBySelector('#section-6 h3.font-semibold.text-yellow-700', 'deepLimits');
        updateElementBySelector('#section-6 .bg-yellow-50 p.text-gray-700', 'deepLimitsDesc');
        updateElementBySelector('#section-6 h3.text-lg.font-semibold.text-indigo-700', 'researchGap');
        updateElementBySelector('#section-6 h4:first-of-type', 'currentMethods');
        updateElementsBySelector('#section-6 .md\\:w-1\\/2:first-of-type .list-disc li', [
            'currentMethodsPoint1', 'currentMethodsPoint2', 'currentMethodsPoint3'
        ]);
        updateElementBySelector('#section-6 h4:last-of-type', 'needForResearch');
        updateElementsBySelector('#section-6 .md\\:w-1\\/2:last-of-type .list-disc li', [
            'needPoint1', 'needPoint2', 'needPoint3'
        ]);

        // Section 7: Research Methods
        updateElementBySelector('#section-7 h1', 'methodsTitle');
        updateElementBySelector('#section-7 h2:first-of-type', 'overviewMethod');
        updateElementBySelector('#section-7 p.text-center.text-gray-600.italic', 'figureFlow');
        updateElementBySelector('#section-7 .bg-blue-50:nth-of-type(1) h3', 'gaborTitle');
        updateElementBySelector('#section-7 .bg-blue-50:nth-of-type(1) p', 'gaborDesc');
        updateElementBySelector('#section-7 .bg-blue-50:nth-of-type(2) h3', 'pcaTitle');
        updateElementBySelector('#section-7 .bg-blue-50:nth-of-type(2) p', 'pcaDesc');
        updateElementBySelector('#section-7 .bg-blue-50:nth-of-type(3) h3', 'knnTitle');
        updateElementBySelector('#section-7 .bg-blue-50:nth-of-type(3) p', 'knnDesc');

        // Section 8: Gabor Feature Extraction
        updateElementBySelector('#section-8 h1', 'gaborFeatureTitle');
        updateElementBySelector('#section-8 h2:first-of-type', 'whyGabor');
        updateElementsBySelector('#section-8 .bg-gray-50:first-of-type .list-disc li', [
            'gaborPoint1', 'gaborPoint2', 'gaborPoint3', 'gaborPoint4', 'gaborPoint5'
        ]);
        updateElementBySelector('#section-8 h2:nth-of-type(2)', 'implementationDetails');
        updateElementsBySelector('#section-8 .bg-gray-50:nth-of-type(2) .list-disc li', [
            'gaborImplementPoint1', 'gaborImplementPoint2', 'gaborImplementPoint3',
            'gaborImplementPoint4', 'gaborImplementPoint5', 'gaborImplementPoint6'
        ]);
        updateElementBySelector('#section-8 p.text-center.text-gray-600.italic', 'gaborFeaturesViz');
        updateElementBySelector('#section-8 h3.font-semibold.text-blue-700', 'gaborFormula');
        updateElementBySelector('#section-8 .bg-blue-50 p.text-gray-700', 'gaborFormulaDesc');

        // Section 9: PCA
        updateElementBySelector('#section-9 h1', 'pcaFullTitle');
        updateElementBySelector('#section-9 h2:first-of-type', 'whyPCA');
        updateElementBySelector('#section-9 h3.font-semibold.text-yellow-700', 'dimensionalityDisaster');
        updateElementBySelector('#section-9 .flex.items-start.mb-4 p.text-gray-700', 'dimensionalityDisasterDesc');
        updateElementBySelector('#section-9 h3.font-semibold.text-green-700', 'pcaSolution');
        updateElementBySelector('#section-9 .flex.items-start:nth-of-type(2) p.text-gray-700', 'pcaSolutionDesc');
        updateElementBySelector('#section-9 h2:nth-of-type(2)', 'implementationDetails');
        updateElementsBySelector('#section-9 .bg-gray-50:nth-of-type(2) .list-disc li', [
            'pcaImplementPoint1', 'pcaImplementPoint2', 'pcaImplementPoint3', 'pcaImplementPoint4'
        ]);
        updateElementBySelector('#section-9 h3.text-center.font-semibold.text-indigo-700', 'pcaProcess');
        updateElementBySelector('#section-9 .text-center:nth-of-type(1) p.text-sm.text-gray-600', 'originalDimension', true);
        updateElementBySelector('#section-9 .text-center:nth-of-type(2) p.text-sm.text-gray-600', 'compressionRatio', true);
        updateElementBySelector('#section-9 .text-center:nth-of-type(3) p.text-sm.text-gray-600', 'reducedDimension', true);
        updateElementBySelector('#section-9 h3.font-semibold.text-yellow-700:nth-of-type(3)', 'keyBenefits');
        updateElementBySelector('#section-9 .bg-yellow-50 p.text-gray-700', 'keyBenefitsDesc');

        // Section 10-16: Continue with similar patterns...

        // Section 16: References and Thank You
        updateElementBySelector('#section-16 h1', 'referencesTitle');
        updateElementBySelector('#section-16 h2.font-semibold.text-indigo-700', 'thankYou');
        updateElementBySelector('#section-16 p.text-gray-700', 'presentedByFooter');
    }

    // Helper functions for DOM manipulation with translations

    // Update element by CSS selector
    function updateElementBySelector(selector, translationKey, isHTML = false) {
        const element = document.querySelector(selector);
        if (element && pageTranslations[currentLanguage][translationKey]) {
            if (isHTML) {
                element.innerHTML = pageTranslations[currentLanguage][translationKey];
            } else {
                element.textContent = pageTranslations[currentLanguage][translationKey];
            }
        }
    }

    // Update multiple elements by CSS selector
    function updateElementsBySelector(selector, translationKeys) {
        const elements = document.querySelectorAll(selector);
        if (elements.length && elements.length === translationKeys.length) {
            elements.forEach((el, index) => {
                if (pageTranslations[currentLanguage][translationKeys[index]]) {
                    el.textContent = pageTranslations[currentLanguage][translationKeys[index]];
                }
            });
        }
    }

    // Update elements by tag within a section
    function updateElementsByTag(sectionSelector, tag, translationKeys) {
        const section = document.querySelector(sectionSelector);
        if (section) {
            const elements = section.querySelectorAll(tag);
            if (elements.length && elements.length === translationKeys.length) {
                elements.forEach((el, index) => {
                    if (pageTranslations[currentLanguage][translationKeys[index]]) {
                        el.textContent = pageTranslations[currentLanguage][translationKeys[index]];
                    }
                });
            }
        }
    }

    // Update element by index from a parent
    function updateElementByIndex(parentSelector, childSelector, index, translationKey) {
        const parent = document.querySelector(parentSelector);
        if (parent) {
            const elements = parent.querySelectorAll(childSelector);
            if (elements.length > index && pageTranslations[currentLanguage][translationKey]) {
                elements[index].textContent = pageTranslations[currentLanguage][translationKey];
            }
        }
    }

    // Update element by finding text content (replacement for :contains)
    function updateElementByText(parentSelector, elementType, searchText, translationKey) {
        const parent = document.querySelector(parentSelector);
        if (!parent) return;

        const elements = parent.querySelectorAll(elementType);
        elements.forEach(el => {
            if (el.textContent.includes(searchText) && pageTranslations[currentLanguage][translationKey]) {
                el.textContent = pageTranslations[currentLanguage][translationKey];
            }
        });
    }

    // Update table cell by content
    function updateTableCellByContent(tableParentSelector, searchText, translationKey) {
        const tableParent = document.querySelector(tableParentSelector);
        if (!tableParent) return;

        const cells = tableParent.querySelectorAll('td');
        cells.forEach(cell => {
            if (cell.textContent.includes(searchText) && pageTranslations[currentLanguage][translationKey]) {
                cell.textContent = pageTranslations[currentLanguage][translationKey];
            }
        });
    }

    // Initialize language based on saved preference or default to English
    function initializeLanguage() {
        // Check if there's a saved language preference
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'id')) {
            currentLanguage = savedLanguage;
        }

        // Set initial button text
        languageButton.innerHTML = `<i class="fas fa-language mr-2"></i> ${uiTranslations[currentLanguage]['languageToggle']}`;

        // Update UI with the selected language
        updateUILanguage();

        // Add print buttons
        addPrintingOptions();
    }

    // Initialize language when the page loads
    initializeLanguage();

    // Handle keyboard navigation
    document.addEventListener('keydown', function (e) {
        let currentSectionId = window.location.hash.replace('#', '') || 'section-1';
        let currentSectionNumber = parseInt(currentSectionId.split('-')[1]) || 1;

        if (e.key === 'ArrowDown' || e.key === ' ') {
            if (currentSectionNumber < totalSections) {
                goToSection(currentSectionNumber + 1);
            }
        } else if (e.key === 'ArrowUp') {
            if (currentSectionNumber > 1) {
                goToSection(currentSectionNumber - 1);
            }
        }
    });

    // Intersection Observer to update active section based on scrolling
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const sectionId = entry.target.id;
                const sectionNumber = parseInt(sectionId.split('-')[1]);

                window.location.hash = sectionId;
                updateActiveSection(sectionNumber);
            }
        });
    }, {
        threshold: 0.5
    });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Check if URL has a hash and navigate to that section
    if (window.location.hash) {
        const sectionId = window.location.hash.replace('#', '');
        const sectionNumber = parseInt(sectionId.split('-')[1]);

        if (sectionNumber >= 1 && sectionNumber <= totalSections) {
            goToSection(sectionNumber);
        }
    }
});