/**
 * Application principale de l'annuaire des agents
 */

// État global de l'application
const appState = {
    currentView: 'table',
    currentPage: 1,
    itemsPerPage: 10,
    selectedEntity: null,
    selectedSite: null,
    selectedAgent: null,
    filters: {
        functions: [],
        groups: [],
        locations: []
    },
    map: null,
    mapMarkers: []
};

// Utilitaires
const utils = {
    getAgentById(id) {
        return data.agents.find(a => a.UTI_MATRICULERH === id);
    },
    
    getEntityByCode(code) {
        return data.entites.find(e => e.ENT_CODERH === code);
    },
    
    getLieuByCode(code) {
        return data.lieux.find(l => l.LIE_CODE === code);
    },
    
    getAgentsByEntity(entityCode) {
        return data.agents.filter(a => a.UTI_CODERH === entityCode);
    },
    
    getAgentsBySite(siteCode) {
        const entityCodes = data.entites
            .filter(e => e.ENT_SITE === siteCode)
            .map(e => e.ENT_CODERH);
        return data.agents.filter(a => entityCodes.includes(a.UTI_CODERH));
    },
    
    getSubEntities(parentCode) {
        return data.entites.filter(e => e.ENT_CODERH_PERE === parentCode);
    },
    
    getHierarchyPath(entityCode) {
        const path = [];
        let current = this.getEntityByCode(entityCode);
        while (current) {
            path.unshift(current);
            current = current.ENT_CODERH_PERE ? this.getEntityByCode(current.ENT_CODERH_PERE) : null;
        }
        return path;
    },
    
    getAllUniqueFunctions() {
        return [...new Set(data.agents.map(a => a.UTI_FONCTION))].sort();
    },
    
    getAllUniqueGroups() {
        const groups = new Set();
        data.agents.forEach(a => {
            if (a.UTI_GROUPES) {
                a.UTI_GROUPES.forEach(g => groups.add(g));
            }
        });
        return [...groups].sort();
    },
    
    getAvatarUrl(agent) {
        const colors = ['azure', 'indigo', 'blue', 'cyan', 'teal', 'green', 'lime', 'pink', 'red', 'orange'];
        const colorIndex = agent.UTI_MATRICULERH.charCodeAt(agent.UTI_MATRICULERH.length - 1) % colors.length;
        const initials = `${agent.UTI_PRENOM[0]}${agent.UTI_NOM[0]}`.toUpperCase();
        return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;
    },
    
    getStatusClass(status) {
        switch(status) {
            case 'online': return 'status-online';
            case 'away': return 'status-away';
            default: return 'status-offline';
        }
    }
};

// Gestion des treeviews jsTree
const treeManager = {
    initEntityTree() {
        const roots = data.entites.filter(e => !e.ENT_CODERH_PERE);
        const treeData = this.buildTreeNodes(roots, 'entity');
        
        $('#entity-tree').jstree({
            'core': {
                'data': treeData,
                'check_callback': true
            },
            'plugins': ['types', 'wholerow', 'search'],
            'types': {
                'default': { 'icon': 'ti ti-building' },
                'direction': { 'icon': 'ti ti-building-skyscraper' },
                'service': { 'icon': 'ti ti-users' }
            }
        });
        
        $('#entity-tree').on('select_node.jstree', (e, data) => {
            const node = data.node;
            if (node.original.entityType === 'entity') {
                appState.selectedEntity = node.original.code;
                appState.selectedSite = null;
                detailPanel.showEntity(node.original.code);
                centerPanel.renderAgents(utils.getAgentsByEntity(node.original.code));
            }
        });
        
        $('#entity-count').text(data.entites.length);
    },
    
    initSiteTree() {
        const domainMap = {
            'Central': { icon: 'ti ti-building-landmark', color: 'blue' },
            'Social': { icon: 'ti ti-heart-handshake', color: 'pink' },
            'Routes': { icon: 'ti ti-road', color: 'orange' },
            'Education': { icon: 'ti ti-school', color: 'green' }
        };
        
        const sitesByDomain = {};
        data.lieux.forEach(lieu => {
            if (!sitesByDomain[lieu.LIE_DOMAINE]) {
                sitesByDomain[lieu.LIE_DOMAINE] = [];
            }
            sitesByDomain[lieu.LIE_DOMAINE].push(lieu);
        });
        
        const treeData = Object.keys(sitesByDomain).map(domain => ({
            text: domain,
            type: 'domain',
            icon: domainMap[domain]?.icon || 'ti ti-map-pin',
            children: sitesByDomain[domain].map(lieu => ({
                text: lieu.LIE_NOM,
                original: {
                    entityType: 'site',
                    code: lieu.LIE_CODE,
                    domaine: lieu.LIE_DOMAINE
                },
                type: 'site',
                icon: 'ti ti-map-pin-filled'
            }))
        }));
        
        $('#site-tree').jstree({
            'core': {
                'data': treeData,
                'check_callback': true
            },
            'plugins': ['types', 'wholerow', 'search'],
            'types': {
                'domain': { 'icon': 'ti ti-folder' },
                'site': { 'icon': 'ti ti-map-pin' }
            }
        });
        
        $('#site-tree').on('select_node.jstree', (e, data) => {
            const node = data.node;
            if (node.original?.entityType === 'site') {
                appState.selectedSite = node.original.code;
                appState.selectedEntity = null;
                detailPanel.showSite(node.original.code);
                centerPanel.renderAgents(utils.getAgentsBySite(node.original.code));
            }
        });
        
        $('#site-count').text(data.lieux.length);
    },
    
    buildTreeNodes(entities, type) {
        return entities.map(entity => {
            const children = utils.getSubEntities(entity.ENT_CODERH);
            const hasChildren = children.length > 0;
            
            return {
                text: entity.ENT_NOM,
                id: entity.ENT_CODERH,
                original: {
                    entityType: 'entity',
                    code: entity.ENT_CODERH,
                    nom: entity.ENT_NOM,
                    site: entity.ENT_SITE
                },
                type: entity.ENT_CODERH_PERE === null ? 'direction' : 'service',
                children: hasChildren ? this.buildTreeNodes(children, type) : false,
                state: { opened: entity.ENT_CODERH_PERE === null }
            };
        });
    },
    
    setupTreeSearch(treeId, searchInputId) {
        $(`#${searchInputId}`).on('input', function() {
            const searchValue = $(this).val();
            const treeInstance = $(`#${treeId}`).jstree(true);
            if (!treeInstance) return;
            
            if (searchValue.length >= 2) {
                treeInstance.search(searchValue);
            } else {
                treeInstance.clear_search();
            }
        });
    }
};

// Gestion du panneau central
const centerPanel = {
    initFilters() {
        // Select2 pour les fonctions
        $('#filter-functions').select2({
            placeholder: 'Fonctions',
            allowClear: true,
            width: '200px',
            data: utils.getAllUniqueFunctions().map(f => ({ id: f, text: f }))
        });
        
        // Select2 pour les groupes
        $('#filter-groups').select2({
            placeholder: 'Groupes',
            allowClear: true,
            width: '200px',
            data: utils.getAllUniqueGroups().map(g => ({ id: g, text: g }))
        });
        
        // Select2 pour les localisations
        $('#filter-locations').select2({
            placeholder: 'Localisations',
            allowClear: true,
            width: '200px',
            data: data.lieux.map(l => ({ id: l.LIE_CODE, text: l.LIE_NOM }))
        });
        
        // Écouteurs d'événements
        $('#filter-functions').on('change', () => {
            appState.filters.functions = $('#filter-functions').val() || [];
            this.updateFilterIndicators();
            this.applyFilters();
        });
        
        $('#filter-groups').on('change', () => {
            appState.filters.groups = $('#filter-groups').val() || [];
            this.updateFilterIndicators();
            this.applyFilters();
        });
        
        $('#filter-locations').on('change', () => {
            appState.filters.locations = $('#filter-locations').val() || [];
            this.updateFilterIndicators();
            this.applyFilters();
        });
        
        $('#clear-filters').on('click', () => {
            $('#filter-functions').val(null).trigger('change');
            $('#filter-groups').val(null).trigger('change');
            $('#filter-locations').val(null).trigger('change');
            appState.filters = { functions: [], groups: [], locations: [] };
            this.updateFilterIndicators();
            this.renderAgents(data.agents);
        });
    },
    
    updateFilterIndicators() {
        const funcCount = appState.filters.functions.length;
        const groupCount = appState.filters.groups.length;
        const locCount = appState.filters.locations.length;
        
        $('#function-filter-count').text(funcCount).toggle(funcCount > 0);
        $('#group-filter-count').text(groupCount).toggle(groupCount > 0);
        $('#location-filter-count').text(locCount).toggle(locCount > 0);
        
        const totalActive = funcCount + groupCount + locCount;
        $('#clear-filters').toggle(totalActive > 0);
        
        if (totalActive === 0) {
            $('#active-filters-info').text('Aucun filtre actif');
        } else {
            $('#active-filters-info').text(`${totalActive} filtre(s) actif(s)`);
        }
    },
    
    applyFilters() {
        let filtered = [...data.agents];
        
        if (appState.filters.functions.length > 0) {
            filtered = filtered.filter(a => appState.filters.functions.includes(a.UTI_FONCTION));
        }
        
        if (appState.filters.groups.length > 0) {
            filtered = filtered.filter(a => 
                a.UTI_GROUPES && a.UTI_GROUPES.some(g => appState.filters.groups.includes(g))
            );
        }
        
        if (appState.filters.locations.length > 0) {
            filtered = filtered.filter(a => {
                const entity = utils.getEntityByCode(a.UTI_CODERH);
                return entity && appState.filters.locations.includes(entity.ENT_SITE);
            });
        }
        
        this.renderAgents(filtered);
    },
    
    renderAgents(agents) {
        appState.currentPage = 1;
        this.renderTable(agents);
        this.renderCards(agents);
        this.renderMap(agents);
    },
    
    renderTable(agents) {
        const start = (appState.currentPage - 1) * appState.itemsPerPage;
        const end = start + appState.itemsPerPage;
        const paginatedAgents = agents.slice(start, end);
        
        const tbody = $('#agents-table-body');
        tbody.empty();
        
        paginatedAgents.forEach(agent => {
            const entity = utils.getEntityByCode(agent.UTI_CODERH);
            const lieu = entity ? utils.getLieuByCode(entity.ENT_SITE) : null;
            
            const row = `
                <tr class="clickable-row" onclick="detailPanel.showAgent('${agent.UTI_MATRICULERH}')">
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar avatar-sm me-2">
                                <img src="${utils.getAvatarUrl(agent)}" alt="${agent.UTI_NOM}">
                            </div>
                            <div>
                                <div class="fw-medium">${agent.UTI_CIVILITE} ${agent.UTI_NOM.toUpperCase()}</div>
                                <div class="text-muted small">${agent.UTI_PRENOM}</div>
                            </div>
                        </div>
                    </td>
                    <td>${agent.UTI_FONCTION}</td>
                    <td><span class="badge bg-blue-lt cursor-pointer" onclick="event.stopPropagation(); detailPanel.showEntity('${agent.UTI_CODERH}')">${entity?.ENT_NOM_COURT || '-'}</span></td>
                    <td><span class="badge bg-green-lt cursor-pointer" onclick="event.stopPropagation(); detailPanel.showSite('${lieu?.LIE_CODE || ''}')">${lieu?.LIE_NOM || '-'}</span></td>
                    <td>
                        <div class="small">${agent.UTI_EMAIL}</div>
                        <div class="text-muted small">${agent.UTI_TELEPHONE}</div>
                    </td>
                    <td>
                        <span class="status-indicator ${utils.getStatusClass(agent.UTI_STATUS)}"></span>
                        <span class="badge ${agent.UTI_PRESENTIEL ? 'bg-success-lt' : 'bg-secondary-lt'}">
                            ${agent.UTI_PRESENTIEL ? 'Présentiel' : 'Distanciel'}
                        </span>
                    </td>
                </tr>
            `;
            tbody.append(row);
        });
        
        $('#total-agents').text(agents.length);
        $('#showing-from').text(agents.length > 0 ? start + 1 : 0);
        $('#showing-to').text(Math.min(end, agents.length));
        
        this.renderPagination(agents.length);
    },
    
    renderCards(agents) {
        const container = $('#cards-view');
        container.empty();
        
        agents.forEach(agent => {
            const entity = utils.getEntityByCode(agent.UTI_CODERH);
            const lieu = entity ? utils.getLieuByCode(entity.ENT_SITE) : null;
            
            const card = `
                <div class="card agent-card" onclick="detailPanel.showAgent('${agent.UTI_MATRICULERH}')">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="avatar avatar-lg me-3">
                                <img src="${utils.getAvatarUrl(agent)}" alt="${agent.UTI_NOM}">
                            </div>
                            <div>
                                <h4 class="mb-0">${agent.UTI_CIVILITE} ${agent.UTI_NOM}</h4>
                                <div class="text-muted">${agent.UTI_PRENOM}</div>
                            </div>
                        </div>
                        <div class="mb-2">
                            <div class="text-muted small">Fonction</div>
                            <div class="fw-medium">${agent.UTI_FONCTION}</div>
                        </div>
                        <div class="mb-2">
                            <div class="text-muted small">Service</div>
                            <span class="badge bg-blue-lt">${entity?.ENT_NOM_COURT || '-'}</span>
                        </div>
                        <div class="mb-2">
                            <div class="text-muted small">Site</div>
                            <span class="badge bg-green-lt">${lieu?.LIE_NOM || '-'}</span>
                        </div>
                        <div class="mt-3 pt-3 border-top">
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="status-indicator ${utils.getStatusClass(agent.UTI_STATUS)}"></span>
                                <div class="d-flex gap-2">
                                    <a href="mailto:${agent.UTI_EMAIL}" class="btn btn-sm btn-icon btn-outline-primary" onclick="event.stopPropagation()">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"/><path d="M3 7l9 6l9 -6"/></svg>
                                    </a>
                                    <a href="tel:${agent.UTI_TELEPHONE}" class="btn btn-sm btn-icon btn-outline-primary" onclick="event.stopPropagation()">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2z"/></svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.append(card);
        });
    },
    
    renderMap(agents) {
        if (!appState.map) {
            appState.map = L.map('leaflet-map').setView([46.58, 0.34], 11);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(appState.map);
        }
        
        // Clear existing markers
        appState.mapMarkers.forEach(marker => appState.map.removeLayer(marker));
        appState.mapMarkers = [];
        
        // Group agents by location
        const agentsByLocation = {};
        agents.forEach(agent => {
            const entity = utils.getEntityByCode(agent.UTI_CODERH);
            if (entity && entity.ENT_SITE) {
                if (!agentsByLocation[entity.ENT_SITE]) {
                    agentsByLocation[entity.ENT_SITE] = [];
                }
                agentsByLocation[entity.ENT_SITE].push(agent);
            }
        });
        
        // Add markers for each location
        Object.keys(agentsByLocation).forEach(siteCode => {
            const lieu = utils.getLieuByCode(siteCode);
            if (lieu) {
                const agentList = agentsByLocation[siteCode];
                
                const marker = L.marker([lieu.LIE_LATITUDE, lieu.LIE_LONGITUDE])
                    .bindPopup(`
                        <div>
                            <strong>${lieu.LIE_NOM}</strong><br>
                            <small>${agentList.length} agent(s)</small><br>
                            <button class="btn btn-sm btn-primary mt-2" onclick="detailPanel.showSite('${lieu.LIE_CODE}')">Voir détails</button>
                        </div>
                    `);
                
                marker.addTo(appState.map);
                appState.mapMarkers.push(marker);
            }
        });
    },
    
    renderPagination(totalItems) {
        const totalPages = Math.ceil(totalItems / appState.itemsPerPage);
        const pagination = $('#pagination');
        pagination.empty();
        
        if (totalPages <= 1) return;
        
        // Previous button
        pagination.append(`
            <li class="page-item ${appState.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="centerPanel.changePage(${appState.currentPage - 1}); return false;">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M15 6l-6 6l6 6"/></svg>
                </a>
            </li>
        `);
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= appState.currentPage - 1 && i <= appState.currentPage + 1)) {
                pagination.append(`
                    <li class="page-item ${i === appState.currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="centerPanel.changePage(${i}); return false;">${i}</a>
                    </li>
                `);
            } else if (i === appState.currentPage - 2 || i === appState.currentPage + 2) {
                pagination.append('<li class="page-item disabled"><span class="page-link">...</span></li>');
            }
        }
        
        // Next button
        pagination.append(`
            <li class="page-item ${appState.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="centerPanel.changePage(${appState.currentPage + 1}); return false;">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M9 6l6 6l-6 6"/></svg>
                </a>
            </li>
        `);
    },
    
    changePage(page) {
        appState.currentPage = page;
        const filteredAgents = this.getFilteredAgents();
        this.renderTable(filteredAgents);
    },
    
    getFilteredAgents() {
        let filtered = [...data.agents];
        
        if (appState.filters.functions.length > 0) {
            filtered = filtered.filter(a => appState.filters.functions.includes(a.UTI_FONCTION));
        }
        
        if (appState.filters.groups.length > 0) {
            filtered = filtered.filter(a => 
                a.UTI_GROUPES && a.UTI_GROUPES.some(g => appState.filters.groups.includes(g))
            );
        }
        
        if (appState.filters.locations.length > 0) {
            filtered = filtered.filter(a => {
                const entity = utils.getEntityByCode(a.UTI_CODERH);
                return entity && appState.filters.locations.includes(entity.ENT_SITE);
            });
        }
        
        return filtered;
    },
    
    setupViewToggle() {
        $('.view-toggle .btn').on('click', function() {
            $('.view-toggle .btn').removeClass('active');
            $(this).addClass('active');
            
            const view = $(this).data('view');
            appState.currentView = view;
            
            $('#table-view').toggle(view === 'table');
            $('#cards-view').toggle(view === 'cards');
            $('#map-view').toggle(view === 'map');
            
            // Invalidate map size when switching to map view
            if (view === 'map') {
                setTimeout(() => {
                    if (appState.map) {
                        appState.map.invalidateSize();
                    }
                }, 200);
            }
        });
    }
};

// Gestion du panneau de détails
const detailPanel = {
    showAgent(matricule) {
        const agent = utils.getAgentById(matricule);
        if (!agent) return;
        
        const entity = utils.getEntityByCode(agent.UTI_CODERH);
        const lieu = entity ? utils.getLieuByCode(entity.ENT_SITE) : null;
        const nPlus1 = agent.UTI_RESP ? utils.getAgentById(agent.UTI_RESP) : null;
        const nPlus2 = agent.UTI_RESP_N2 ? utils.getAgentById(agent.UTI_RESP_N2) : null;
        
        appState.selectedAgent = matricule;
        
        const content = `
            <div class="detail-header">
                <div class="detail-avatar">
                    <img src="${utils.getAvatarUrl(agent)}" alt="${agent.UTI_NOM}" class="rounded-circle w-100 h-100 object-cover">
                </div>
                <h4 class="mb-0">${agent.UTI_CIVILITE} ${agent.UTI_NOM.toUpperCase()}</h4>
                <p class="text-muted mb-1">${agent.UTI_PRENOM}</p>
                <span class="badge ${agent.UTI_PRESENTIEL ? 'bg-success-lt' : 'bg-secondary-lt'}">
                    <span class="status-indicator ${utils.getStatusClass(agent.UTI_STATUS)}"></span>
                    ${agent.UTI_PRESENTIEL ? 'En présentiel' : 'En distanciel'}
                </span>
            </div>
            <div class="detail-body">
                <div class="detail-section">
                    <div class="detail-label">Fonction & Grade</div>
                    <div class="fw-medium">${agent.UTI_FONCTION}</div>
                    <div class="text-muted small">${agent.UTI_GRADE} - ${agent.UTI_STATUT}</div>
                </div>
                
                <div class="detail-section">
                    <div class="detail-label">Coordonnées</div>
                    <div class="d-flex align-items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler me-2" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"/><path d="M3 7l9 6l9 -6"/></svg>
                        <a href="mailto:${agent.UTI_EMAIL}" class="clickable-link">${agent.UTI_EMAIL}</a>
                    </div>
                    <div class="d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler me-2" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2z"/></svg>
                        <a href="tel:${agent.UTI_TELEPHONE}" class="clickable-link">${agent.UTI_TELEPHONE}</a>
                    </div>
                </div>
                
                <div class="detail-section">
                    <div class="detail-label">Rattachement</div>
                    <div class="mb-2">
                        <div class="text-muted small">Service</div>
                        <span class="badge bg-blue-lt cursor-pointer" onclick="detailPanel.showEntity('${entity?.ENT_CODERH || ''}')">${entity?.ENT_NOM || '-'}</span>
                    </div>
                    <div class="mb-2">
                        <div class="text-muted small">Site</div>
                        <span class="badge bg-green-lt cursor-pointer" onclick="detailPanel.showSite('${lieu?.LIE_CODE || ''}')">${lieu?.LIE_NOM || '-'}</span>
                    </div>
                </div>
                
                ${nPlus1 || nPlus2 ? `
                <div class="detail-section">
                    <div class="detail-label">Hiérarchie</div>
                    ${nPlus1 ? `
                    <div class="mb-2">
                        <div class="text-muted small">N+1</div>
                        <div class="d-flex align-items-center">
                            <div class="avatar avatar-xs me-2">
                                <img src="${utils.getAvatarUrl(nPlus1)}" alt="${nPlus1.UTI_NOM}">
                            </div>
                            <span class="clickable-link" onclick="detailPanel.showAgent('${nPlus1.UTI_MATRICULERH}')">${nPlus1.UTI_CIVILITE} ${nPlus1.UTI_NOM}</span>
                        </div>
                    </div>
                    ` : ''}
                    ${nPlus2 ? `
                    <div class="mb-2">
                        <div class="text-muted small">N+2</div>
                        <div class="d-flex align-items-center">
                            <div class="avatar avatar-xs me-2">
                                <img src="${utils.getAvatarUrl(nPlus2)}" alt="${nPlus2.UTI_NOM}">
                            </div>
                            <span class="clickable-link" onclick="detailPanel.showAgent('${nPlus2.UTI_MATRICULERH}')">${nPlus2.UTI_CIVILITE} ${nPlus2.UTI_NOM}</span>
                        </div>
                    </div>
                    ` : ''}
                </div>
                ` : ''}
                
                ${agent.UTI_GROUPES && agent.UTI_GROUPES.length > 0 ? `
                <div class="detail-section">
                    <div class="detail-label">Groupes</div>
                    <div class="d-flex flex-wrap gap-1">
                        ${agent.UTI_GROUPES.map(g => `<span class="badge bg-purple-lt cursor-pointer" onclick="centerPanel.filters.groups.push('${g}'); centerPanel.applyFilters();">${g}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        this.render(content);
    },
    
    showEntity(entityCode) {
        const entity = utils.getEntityByCode(entityCode);
        if (!entity) return;
        
        const lieu = utils.getLieuByCode(entity.ENT_SITE);
        const responsable = data.agents.find(a => a.UTI_CODERH === entityCode && a.UTI_RESP === null);
        const agents = utils.getAgentsByEntity(entityCode);
        
        const content = `
            <div class="detail-header bg-blue-lt">
                <div class="avatar avatar-lg mb-2 bg-blue text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="40" height="40" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/></svg>
                </div>
                <h4 class="mb-0">${entity.ENT_NOM}</h4>
                <p class="text-muted">${entity.ENT_NOM_COURT}</p>
            </div>
            <div class="detail-body">
                <div class="detail-section">
                    <div class="detail-label">Missions</div>
                    <p class="mb-0">${entity.ENT_MISSIONS}</p>
                </div>
                
                <div class="detail-section">
                    <div class="detail-label">Localisation</div>
                    <div class="d-flex align-items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler me-2" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.828 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"/></svg>
                        <span class="clickable-link" onclick="detailPanel.showSite('${lieu?.LIE_CODE || ''}')">${lieu?.LIE_NOM || 'Non défini'}</span>
                    </div>
                    <div class="text-muted small">${lieu?.LIE_ADRESSE || ''}</div>
                </div>
                
                ${responsable ? `
                <div class="detail-section">
                    <div class="detail-label">Responsable</div>
                    <div class="d-flex align-items-center">
                        <div class="avatar avatar-sm me-2">
                            <img src="${utils.getAvatarUrl(responsable)}" alt="${responsable.UTI_NOM}">
                        </div>
                        <span class="clickable-link" onclick="detailPanel.showAgent('${responsable.UTI_MATRICULERH}')">${responsable.UTI_CIVILITE} ${responsable.UTI_NOM}</span>
                    </div>
                </div>
                ` : ''}
                
                <div class="detail-section">
                    <div class="detail-label">Effectif</div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="text-muted">Agents dans ce service</span>
                        <span class="badge bg-blue">${agents.length}</span>
                    </div>
                    ${agents.length > 0 ? `
                    <div class="agent-list-scrollable">
                        ${agents.map(a => `
                            <div class="d-flex align-items-center py-2 border-bottom" onclick="detailPanel.showAgent('${a.UTI_MATRICULERH}')" style="cursor: pointer;">
                                <div class="avatar avatar-xs me-2">
                                    <img src="${utils.getAvatarUrl(a)}" alt="${a.UTI_NOM}">
                                </div>
                                <div class="flex-grow-1">
                                    <div class="small fw-medium">${a.UTI_CIVILITE} ${a.UTI_NOM}</div>
                                    <div class="text-muted small" style="font-size: 0.7rem;">${a.UTI_FONCTION}</div>
                                </div>
                                <span class="status-indicator ${utils.getStatusClass(a.UTI_STATUS)}"></span>
                            </div>
                        `).join('')}
                    </div>
                    ` : '<div class="text-muted small">Aucun agent dans ce service</div>'}
                </div>
            </div>
        `;
        
        this.render(content);
    },
    
    showSite(siteCode) {
        const lieu = utils.getLieuByCode(siteCode);
        if (!lieu) return;
        
        const agents = utils.getAgentsBySite(siteCode);
        const entities = data.entites.filter(e => e.ENT_SITE === siteCode);
        
        const domainColors = {
            'Central': 'blue',
            'Social': 'pink',
            'Routes': 'orange',
            'Education': 'green'
        };
        
        const content = `
            <div class="detail-header bg-${domainColors[lieu.LIE_DOMAINE] || 'secondary'}-lt">
                <div class="avatar avatar-lg mb-2 bg-${domainColors[lieu.LIE_DOMAINE] || 'secondary'} text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="40" height="40" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.828 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"/></svg>
                </div>
                <h4 class="mb-0">${lieu.LIE_NOM}</h4>
                <p class="text-muted">${lieu.LIE_DOMAINE}</p>
            </div>
            <div class="detail-body">
                <div class="detail-section">
                    <div class="detail-label">Adresse</div>
                    <p class="mb-1">${lieu.LIE_ADRESSE}</p>
                    <div class="d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler me-2" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"><path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2z"/></svg>
                        <a href="tel:${lieu.LIE_CONTACT}" class="clickable-link">${lieu.LIE_CONTACT}</a>
                    </div>
                </div>
                
                <div class="detail-section">
                    <div class="detail-label">Services sur ce site</div>
                    <div class="d-flex flex-wrap gap-1 mb-2">
                        ${entities.map(e => `<span class="badge bg-blue-lt cursor-pointer" onclick="detailPanel.showEntity('${e.ENT_CODERH}')">${e.ENT_NOM_COURT}</span>`).join('')}
                    </div>
                </div>
                
                <div class="detail-section">
                    <div class="detail-label">Agents présents</div>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="text-muted">Total</span>
                        <span class="badge bg-green">${agents.length}</span>
                    </div>
                    ${agents.length > 0 ? `
                    <div class="agent-list-scrollable">
                        ${agents.map(a => `
                            <div class="d-flex align-items-center py-2 border-bottom" onclick="detailPanel.showAgent('${a.UTI_MATRICULERH}')" style="cursor: pointer;">
                                <div class="avatar avatar-xs me-2">
                                    <img src="${utils.getAvatarUrl(a)}" alt="${a.UTI_NOM}">
                                </div>
                                <div class="flex-grow-1">
                                    <div class="small fw-medium">${a.UTI_CIVILITE} ${a.UTI_NOM}</div>
                                    <div class="text-muted small" style="font-size: 0.7rem;">${a.UTI_FONCTION}</div>
                                </div>
                                <span class="status-indicator ${utils.getStatusClass(a.UTI_STATUS)}"></span>
                            </div>
                        `).join('')}
                    </div>
                    ` : '<div class="text-muted small">Aucun agent sur ce site</div>'}
                </div>
                
                <div class="detail-section">
                    <div class="detail-label">Carte</div>
                    <div id="mini-map" style="height: 150px; border-radius: var(--tblr-border-radius);"></div>
                </div>
            </div>
        `;
        
        this.render(content);
        
        // Mini carte
        setTimeout(() => {
            const miniMap = L.map('mini-map', { zoomControl: false }).setView([lieu.LIE_LATITUDE, lieu.LIE_LONGITUDE], 14);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(miniMap);
            L.marker([lieu.LIE_LATITUDE, lieu.LIE_LONGITUDE]).addTo(miniMap);
        }, 100);
    },
    
    render(content) {
        $('#empty-state').hide();
        $('#detail-content').html(content).show();
    },
    
    reset() {
        $('#empty-state').show();
        $('#detail-content').hide();
    }
};

// Gestion des drawers mobile
function toggleDrawer(side) {
    const drawer = $(`#${side}-drawer`);
    const overlay = $('#drawer-overlay');
    
    if (drawer.hasClass('show')) {
        closeAllDrawers();
    } else {
        closeAllDrawers();
        drawer.addClass('show');
        overlay.show();
        
        // Copier le contenu approprié
        if (side === 'left') {
            $('#mobile-trees').html($('#left-panel').html());
            // Réinitialiser les treeviews dans le drawer
            $('#mobile-trees .tree-container').each(function() {
                const treeId = $(this).find('[id$="-tree"]').attr('id');
                if (treeId) {
                    $(`#${treeId}`).jstree('destroy');
                }
            });
        } else if (side === 'right') {
            $('#mobile-detail').html($('#detail-panel').html());
        }
    }
}

function closeAllDrawers() {
    $('.drawer').removeClass('show');
    $('#drawer-overlay').hide();
}

// Export de données
function exportData(format) {
    const filteredAgents = centerPanel.getFilteredAgents();
    
    if (format === 'excel') {
        // Simulation d'export Excel
        let csvContent = "Matricule;Civilité;Nom;Prénom;Fonction;Grade;Service;Email;Téléphone;Statut\n";
        filteredAgents.forEach(a => {
            const entity = utils.getEntityByCode(a.UTI_CODERH);
            csvContent += `${a.UTI_MATRICULERH};${a.UTI_CIVILITE};${a.UTI_NOM};${a.UTI_PRENOM};${a.UTI_FONCTION};${a.UTI_GRADE};${entity?.ENT_NOM || '-'};${a.UTI_EMAIL};${a.UTI_TELEPHONE};${a.UTI_STATUT}\n`;
        });
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'annuaire_agents.csv';
        link.click();
    } else if (format === 'pdf') {
        alert('Export PDF : Fonctionnalité à implémenter avec une librairie comme jsPDF ou html2pdf');
    }
}

// Recherche globale avec autocompletion
function setupGlobalSearch() {
    // Fonction pour obtenir toutes les suggestions
    function getSearchSuggestions() {
        const suggestions = {
            agents: [],
            entities: [],
            sites: []
        };
        
        // Agents
        data.agents.forEach(a => {
            suggestions.agents.push({
                id: `agent_${a.UTI_MATRICULERH}`,
                type: 'agent',
                text: `${a.UTI_CIVILITE} ${a.UTI_NOM} ${a.UTI_PRENOM}`,
                subtext: a.UTI_FONCTION,
                icon: 'user'
            });
        });
        
        // Entités
        data.entites.forEach(e => {
            suggestions.entities.push({
                id: `entity_${e.ENT_CODERH}`,
                type: 'entity',
                text: e.ENT_NOM,
                subtext: e.ENT_NOM_COURT,
                icon: 'building'
            });
        });
        
        // Sites
        data.lieux.forEach(l => {
            suggestions.sites.push({
                id: `site_${l.LIE_CODE}`,
                type: 'site',
                text: l.LIE_NOM,
                subtext: l.LIE_DOMAINE,
                icon: 'map-pin'
            });
        });
        
        return suggestions;
    }
    
    const allSuggestions = getSearchSuggestions();
    
    // Build flat data array for Select2
    const select2Data = [
        ...allSuggestions.agents.map(s => ({ 
            id: s.id, 
            text: s.text + ' - ' + s.subtext,
            title: s.text,
            subtitle: s.subtext,
            category: 'Agent'
        })),
        ...allSuggestions.entities.map(s => ({ 
            id: s.id, 
            text: s.text + ' (' + s.subtext + ')',
            title: s.text,
            subtitle: s.subtext,
            category: 'Entité'
        })),
        ...allSuggestions.sites.map(s => ({ 
            id: s.id, 
            text: s.text + ' - ' + s.subtext,
            title: s.text,
            subtitle: s.subtext,
            category: 'Site'
        }))
    ];
    
    // Initialiser Select2 pour la recherche globale
    $('#global-search').select2({
        placeholder: 'Rechercher un agent, un site, une entité...',
        allowClear: true,
        dropdownParent: $('body'),
        data: select2Data,
        templateResult: function(item) {
            if (!item.id) return item.text;
            return $('<div class="d-flex flex-column">' +
                '<span class="fw-medium">' + (item.title || item.text) + '</span>' +
                '<small class="text-muted">' + (item.subtitle || '') + '</small>' +
                '</div>');
        },
        templateSelection: function(item) {
            if (!item.id) return item.text;
            return item.title || item.text;
        }
    }).on('select2:select', function(e) {
        const selectedId = e.params.data.id;
        const [type, code] = selectedId.split('_');
        
        if (type === 'agent') {
            detailPanel.showAgent(code);
        } else if (type === 'entity') {
            detailPanel.showEntity(code);
            centerPanel.renderAgents(utils.getAgentsByEntity(code));
        } else if (type === 'site') {
            detailPanel.showSite(code);
            centerPanel.renderAgents(utils.getAgentsBySite(code));
        }
        
        // Reset search
        $('#global-search').val(null).trigger('change');
    });
}

// Initialisation de l'application
$(document).ready(function() {
    console.log('Initialisation de l\'annuaire des agents...');
    
    // Initialiser les treeviews
    treeManager.initEntityTree();
    treeManager.initSiteTree();
    
    // Configurer la recherche dans les arbres
    treeManager.setupTreeSearch('entity-tree', 'entity-tree-search');
    treeManager.setupTreeSearch('site-tree', 'site-tree-search');
    
    // Initialiser les filtres
    centerPanel.initFilters();
    
    // Configurer le toggle de vue
    centerPanel.setupViewToggle();
    
    // Afficher tous les agents par défaut
    centerPanel.renderAgents(data.agents);
    
    // Configurer la recherche globale
    setupGlobalSearch();
    
    console.log('Annuaire des agents prêt!');
});
