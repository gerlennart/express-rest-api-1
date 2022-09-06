const App = {
    data() {
        return {
            debug: false,            

            // Tabelle Hauptfenster
            sortCategory: 'spezies',
            tiere: [],

            // createModal
            createModal: null,
            createTierObject: {},            

            // updateModal
            updateModal: null,
            updateTierObject: {},

            // deleteModal
            deleteModal: null,
            deleteTierObject: {}
        };
    },

    methods: {        
        //---------------------------------------
        // Zugriff auf Daten über REST-API (CRUD)
        //---------------------------------------
        // CREATE
        postNewTier(tier) {
            // POST /tiere/
            fetch('/tiere/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tier),
            })
        },

        // READ
        getAllTiere() {
            // Sortierkategorie ermitteln
            const sortierKategorie = this.sortCategory;
                        
            // Daten von REST-API holen
            // GET /tiere/            
            fetch(`/tiere/?order=${sortierKategorie}`)
                .then(response => response.json())
                .then(data => this.tiere = data);
        },

        // UPDATE
        updateTier(tier) {
            // PUT /tiere/{id}            
            fetch(`/tiere/${tier.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tier)
            })
        },

        // DELETE
        deleteTier(id) {
            // DELETE /tiere/{id}            
            fetch(`/tiere/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        },

        //--------------------------------------
        // EventListener für Buttons
        //---------------------------------------
        // CREATE
        buttonCreateClick() {
            this.createTierObject.spezies = 'Neu';
            this.createTierObject.farbe = 'neue Farbe';
            this.createTierObject.telefon = '012345';            
            this.createTierObject.saeugetier = true;            
            this.createModal.show();
        },

        buttonCreateSpeichernClick() {
            this.postNewTier(this.createTierObject);
            this.createModal.hide();
            this.getAllTiere();            
        },

        // UPDATE
        buttonUpdateClick(tier) {
            // Kopie des Tieres erstellen
            this.updateTierObject = JSON.parse(JSON.stringify(tier));
            this.updateModal.show();
        },

        buttonUpdateSpeichernClick() {
            this.updateTier(this.updateTierObject);
            this.updateModal.hide();
            this.getAllTiere();
        },

        // DELETE
        buttonDeleteClick(tier) {
            // Kopie des Tieres erstellen
            this.deleteTierObject = JSON.parse(JSON.stringify(tier));
            this.deleteModal.show();
        },

        buttonDeleteConfirmClick() {
            this.deleteTier(this.deleteTierObject.id);
            this.deleteModal.hide();
            this.getAllTiere();            
        },

        //--------------------------------------
        // Sonstige Methoden
        //---------------------------------------
        boolToJaNein(boolWert){
            if(boolWert){
                return 'ja';
            }else{
                return 'nein';
            }
        },

        telefonumrechnung(telefon){
            return `tel:${telefon}`;
        }
    },

    watch: {
        sortCategory(){
           this.getAllTiere();           
        }
    },

    // START
    mounted() {
        this.createModal = new bootstrap.Modal(this.$refs.createModal);
        this.updateModal = new bootstrap.Modal(this.$refs.updateModal);
        this.deleteModal = new bootstrap.Modal(this.$refs.deleteModal);
        this.getAllTiere();
    }
};
Vue.createApp(App).mount('#app');