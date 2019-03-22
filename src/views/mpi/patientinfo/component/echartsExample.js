let myChart
const domCode = document.getElementById('sidebar-code')
const domGraphic = document.getElementById('graphic')
const domMain = document.getElementById('main')
const domMessage = document.getElementById('wrong-message')
const iconResize = document.getElementById('icon-resize')
let needRefresh = false

const enVersion = location.hash.indexOf('-en') !== -1
let hash = location.hash.replace('-en', '')
hash = hash.replace('#', '') || (needMap() ? 'default' : 'macarons')
hash += enVersion ? '-en' : ''

let curTheme

function requireCallback(ec, defaultTheme) {
  curTheme = themeSelector ? defaultTheme : {}
  echarts = ec
  refresh()
  window.onresize = myChart.resize
}

var themeSelector = $('#theme-select')
if (themeSelector) {
  themeSelector.html(
    '<option selected="true" name="macarons">macarons</option>' +
        '<option name="infographic">infographic</option>' +
        '<option name="shine">shine</option>' +
        '<option name="dark">dark</option>' +
        '<option name="blue">blue</option>' +
        '<option name="green">green</option>' +
        '<option name="red">red</option>' +
        '<option name="gray">gray</option>' +
        '<option name="helianthus">helianthus</option>' +
        '<option name="roma">roma</option>' +
        '<option name="mint">mint</option>' +
        '<option name="macarons2">macarons2</option>' +
        '<option name="sakura">sakura</option>' +
        '<option name="default">default</option>'
  )
  $(themeSelector).on('change', function() {
    selectChange($(this).val())
  })

  if ($(themeSelector).val(hash.replace('-en', '')).val() !== hash.replace('-en', '')) {
    $(themeSelector).val('macarons')
    hash = 'macarons' + enVersion ? '-en' : ''
    window.location.hash = hash
  }
}
function selectChange(value) {
  const theme = value
  myChart.showLoading()
  $(themeSelector).val(theme)
  if (theme !== 'default') {
    window.location.hash = value + (enVersion ? '-en' : '')
    require(['theme/' + theme], function(tarTheme) {
      curTheme = tarTheme
      setTimeout(refreshTheme, 500)
    })
  } else {
    window.location.hash = enVersion ? '-en' : ''
    curTheme = {}
    setTimeout(refreshTheme, 500)
  }
}
function refreshTheme() {
  myChart.hideLoading()
  myChart.setTheme(curTheme)
}

function autoResize() {
  if ($(iconResize).hasClass('glyphicon-resize-full')) {
    focusCode()
    iconResize.className = 'glyphicon glyphicon-resize-small'
  } else {
    focusGraphic()
    iconResize.className = 'glyphicon glyphicon-resize-full'
  }
}

function focusCode() {
  domCode.className = 'col-md-8 ani'
  domGraphic.className = 'col-md-4 ani'
}

function focusGraphic() {
  domCode.className = 'col-md-4 ani'
  domGraphic.className = 'col-md-8 ani'
  if (needRefresh) {
    myChart.showLoading()
    setTimeout(refresh, 1000)
  }
}

const editor = CodeMirror.fromTextArea(
  document.getElementById('code'),
  { lineNumbers: true }
)
editor.setOption('theme', 'monokai')

editor.on('change', function() { needRefresh = true })

function refresh(isBtnRefresh) {
  if (isBtnRefresh) {
    needRefresh = true
    focusGraphic()
    return
  }
  needRefresh = false
  if (myChart && myChart.dispose) {
    myChart.dispose()
  }
  myChart = echarts.init(domMain, curTheme)
  window.onresize = myChart.resize;
  (new Function(editor.doc.getValue()))()
  myChart.setOption(option, true)
  domMessage.innerHTML = ''
}

function needMap() {
  const href = location.href
  return href.indexOf('map') !== -1 ||
           href.indexOf('mix3') !== -1 ||
           href.indexOf('mix5') !== -1 ||
           href.indexOf('dataRange') !== -1
}

var echarts
const developMode = false

if (developMode) {
  window.esl = null
  window.define = null
  window.require = null;
  (function() {
    const script = document.createElement('script')
    script.async = true

    const pathname = location.pathname

    const pathSegs = pathname.slice(pathname.indexOf('doc')).split('/')
    const pathLevelArr = new Array(pathSegs.length - 1)
    script.src = pathLevelArr.join('../') + 'asset/js/esl/esl.js'
    if (script.readyState) {
      script.onreadystatechange = fireLoad
    } else {
      script.onload = fireLoad
    }
    (document.getElementsByTagName('head')[0] || document.body).appendChild(script)

    function fireLoad() {
      script.onload = script.onreadystatechange = null
      setTimeout(loadedListener, 100)
    }
    function loadedListener() {
      // for develop
      require.config({
        packages: [
          {
            name: 'echarts',
            location: '../../src',
            main: 'echarts'
          },
          {
            name: 'zrender',
            // location: 'http://ecomfe.github.io/zrender/src',
            location: '../../../zrender/src',
            main: 'zrender'
          }
        ]
      })
      launchExample()
    }
  })()
} else {
  // for echarts online home page
  require.config({
    paths: {
      echarts: './www/js'
    }
  })
  launchExample()
}

let isExampleLaunched

function launchExample() {
  if (isExampleLaunched) {
    return
  }

  // 按需加载
  isExampleLaunched = 1
  require(
    [
      'echarts',
      'theme/' + hash.replace('-en', ''),
      'echarts/chart/line',
      'echarts/chart/bar',
      'echarts/chart/scatter',
      'echarts/chart/k',
      'echarts/chart/pie',
      'echarts/chart/radar',
      'echarts/chart/force',
      'echarts/chart/chord',
      'echarts/chart/gauge',
      'echarts/chart/funnel',
      'echarts/chart/eventRiver',
      'echarts/chart/venn',
      'echarts/chart/treemap',
      'echarts/chart/tree',
      'echarts/chart/wordCloud',
      'echarts/chart/heatmap',
      needMap() ? 'echarts/chart/map' : 'echarts'
    ],
    requireCallback
  )
}

