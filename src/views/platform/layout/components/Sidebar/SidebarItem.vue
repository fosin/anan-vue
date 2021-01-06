<template>
  <div v-if="!item.hidden&&item.children&&item.children.length > 0" class="menu-wrapper">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <a :href="onlyOneChild.path" target="_blank" @click="clickLink(onlyOneChild,$event)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item v-if="onlyOneChild.meta" :icon="onlyOneChild.meta.icon||item.meta.icon" :title="generateTitle(onlyOneChild.meta.title)" />
        </el-menu-item>
      </a>
    </template>

    <el-submenu v-else :index="item.name||item.path">
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta.icon" :title="generateTitle(item.meta.title)" />
      </template>

      <template v-for="child in item.children">
        <template v-if="!child.hidden">
          <sidebar-item
            v-if="child.children&&child.children.length>0"
            :key="child.path"
            :is-nest="true"
            :item="child"
            :base-path="resolvePath(child.path)"
            class="nest-menu"
          />
          <a v-else :key="child.name" :href="child.path" target="_blank" @click="clickLink(child,$event)">
            <el-menu-item :index="resolvePath(child.path)">
              <item v-if="child.meta" :icon="child.meta.icon" :title="generateTitle(child.meta.title)" />
            </el-menu-item>
          </a>
        </template>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import { generateTitle } from '@/utils/i18n'
import router from '@/router/index'
import path from 'path'
import { validateURL, isExternal } from '@/utils/validate'
import Item from './Item'
export default {
  name: 'SidebarItem',
  components: { Item },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null
    }
  },
  methods: {
    hasOneShowingChild(children, parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },
    isExternalLink(routePath) {
      return validateURL(routePath)
    },
    clickLink(child, e) {
      const routePath = child.path
      if (!this.isExternalLink(routePath)) {
        if (e) {
          e.preventDefault()
        }
        const path = this.resolvePath(routePath)
        const type = child.meta.type
        switch (type) {
          case 2:
            router.push({ path: path, query: { src: child.meta.src }})
            break
          case 4:
            router.push({ path: path, query: { url: child.meta.url }})
            break
          default:
            router.push({ path: path })
        }
      }
    },
    generateTitle
  }
}
</script>

