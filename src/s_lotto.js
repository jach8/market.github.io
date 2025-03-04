
// Rounding Function 
function round(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

const columnDefsLottos = [
    {
      sortable: true,
      headerName: 'Description',
      pinned: "left",
      lockPinned: true,
      cellClass: 'lock-pinned',
      maxWidth: 200,
      valueGetter: function(params) {return params.node.data.stock + " " + params.node.data.type + " " + params.node.data.strike + " " + params.node.data.exp;},
      hide:true,
    },
    {
      field: 'stock',
      sortable: true,
      headerName: 'Stock',
      pinned: "left",
      lockPinned: true,
      cellClass: 'lock-pinned',
      maxWidth: 100,
      hide:false,
    },
    {
      field: 'type',
      sortable: true,
      headerName: 'Type',
      lockPinned: false,
      maxWidth: 75,
      hide:false,
      pinned: "left",
    },
    {
      field: 'contractsymbol',
      sortable: true,
      headerName: 'Contract Symbol',
      hide: true,
    },
    {
      field: 'strike',
      sortable: true,
      headerName: 'Strike',
      lockPinned: true,
      cellClass: 'lock-pinned',
      maxWidth: 100,
      hide:false,
      pinned: "left",
    },
    {
      field: 'exp',
      sortable: true,
      headerName: 'Expiration',
      filter: 'agDateColumnFilter',
      filterParams: {
        // Assuming 'exp' is stored in a format like 'YYYY-MM-DD'
        comparator: function(filterLocalDateAtMidnight, cellValue) {
          let dateAsString = cellValue;
          if (dateAsString == null) return -1;
          
          let cellDate = new Date(dateAsString);
          
          // Now that both parameters are Date objects, we can compare
          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          } else if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          } else {
            return 0;
          }
        }
      },
      valueFormatter: params => params.value, // Simplified function for identity transform
      maxWidth: 125,
      hide:false,
    },
      
    {
      field: 'lastprice',
      sortable: true,
      headerName: 'Last',
      valueFormatter: function(params) {
        return "$" + params.value.toFixed(2);
      },
      // Removed commented-out cell renderer
      maxWidth: 100,
    },
    {
      field: 'moneyness',
      headerName: 'Moneyness',
      sortable: true,
      valueFormatter: function(params) {
        return params.value.toFixed(2);
      },
      maxWidth: 115,
    },
    {
      field: 'percentchange',
      headerName: '%CHNG',
      sortable: true,
      valueFormatter: function(params) {
        return params.value > 0 ? "↑ " + params.value.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%" : "↓ " + params.value.toFixed(1).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "%";
      },
      cellStyle: function(params) {
        return params.value > 0 ? {'color': 'green'} : {'color': 'red'};
      },
      maxWidth: 120,
    },
    {
      field:'lastprice_avg_30d',
      headerName: 'AvgPrice',
      sortable: true,
      valueFormatter: function(params) {
        return "$" + params.value.toFixed(2);
      },
      maxWidth: 120,
    },
    {
      field: 'volume',
      headerName: 'Volume',
      valueFormatter: function(params) {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      // Removed commented-out cell renderer
      maxWidth: 150,
    },
    {
      field: 'vol_chg',
      valueFormatter: function(params) {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      hide: false,
      maxWidth: 120,
    },
    {
      field: 'voi',
      headerName: 'VOI',
      // valueFormatter: x => x.toFixed(2), // Arrow function for concise formatting
      hide: false,
      maxWidth: 120,
    },
    {
      field: 'openinterest',
      headerName: 'OI',
      valueFormatter: function(params) {
        return params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
      maxWidth: 120,
    },
    {
      field: 'oi_chg',
      headerName: 'OI CHNG',
      hide: false,
      valueFormatter: function(params) {
        const formattedChange = params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return params.value > 0 ? "↑ " + formattedChange : "↓ " + formattedChange;
      },
      cellStyle: function(params) {
        return params.value > 0 ? {'color': 'green'} : {'color': 'red'};
      },
      maxWidth: 160,
    },
    {
      field: 'change',
      headerName: '$ Change',
      sortable: true,
      valueFormatter: function(params) {
        return "$" + params.value.toFixed(2);
      },
      hide: true,
    },
    {
      field:'impliedvolatility', 
      headerName: 'IV',
      sortable: true,
      valueFormatter: function(params) {
        return params.value.toFixed(2) + "%";
      },
      hide: false,
      maxWidth: 100,
    },
    {
      field:'iv_avg_30d',
      headerName: 'AvgIV',
      sortable: true,
      valueFormatter: function(params) {
        return params.value.toFixed(2) + "%";
      },
      hide: false,
      maxWidth: 100,
    }

];
 
  
const cgrid = {
    rowData:[], 
    columnDefs: columnDefsLottos,
};

lottosGrid = agGrid.createGrid(document.querySelector('#contracts_grid'), cgrid);

function reset_grid(){
    lottosGrid.setGridOption('rowData', []);
}

function getVolumeMovers(){
  reset_grid();
    fetch('../data/contracts/vol.json')
        .then(response => response.json())
        .then((cdata) => lottosGrid.setGridOption('rowData', cdata))
        .then(() => lottosGrid.applyColumnState(
            {state: [{colId:'volume', sort:'desc'}], defaultState: {sort: null}})
        );
};

function getOIMovers(){
  reset_grid();
    fetch('../data/contracts/oi.json')
        .then(response => response.json())
        .then((cdata) => lottosGrid.setGridOption('rowData', cdata))
        .then(() => lottosGrid.applyColumnState(
            {state: [{colId:'oi_chg', sort:'desc'}], defaultState: {sort: null}})
        );
};

function getVOIMovers(){
    reset_grid();
    fetch('../data/contracts/voi.json')
        .then(response => response.json())
        .then((cdata) => lottosGrid.setGridOption('rowData', cdata))
        .then(() => lottosGrid.applyColumnState(
            {state: [{colId:'volume', sort:'desc'}], defaultState: {sort: null}})
        );
}


getVolumeMovers();