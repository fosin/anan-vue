export function controlCopy(control) {
  controlContextmenu(control)
  controlSelectStart(control)
  controlKeydown(control)
}

export function controlContextmenu(control) {
  if (control) {
    // 禁止鼠标右键菜单
    document.oncontextmenu = new Function('event.returnValue=false')
  } else {
    // 恢复鼠标右键菜单
    document.oncontextmenu = new Function('event.returnValue=true')
  }
}

export function controlSelectStart(control) {
  if (control) {
    // 禁止选择
    document.onselectstart = new Function('event.returnValue=false')
  } else {
    // 恢复选择
    document.onselectstart = new Function('event.returnValue=true')
  }
}

// 禁用Ctrl+S、Ctrl+C、Ctrl+V、Ctrl+P、Ctrl+T
export function controlKeydown(control) {
  if (control) {
    // 监听键盘按下事件
    document.onkeydown = function() {
      if (event.ctrlKey === true &&
        (event.keyCode === 80 || event.keyCode === 83 || event.keyCode === 84 || event.keyCode === 67 || event.keyCode === 86)) {
        return false
      }
    }
  } else {
    // 恢复 Ctrl+S
    document.onkeydown = function() {
      if (event.ctrlKey === true &&
        (event.keyCode === 80 || event.keyCode === 83 || event.keyCode === 84 || event.keyCode === 67 || event.keyCode === 86)) {
        return true
      }
    }
  }
}
