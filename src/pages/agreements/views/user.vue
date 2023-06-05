<template>
<div>
  <div ref="content" class="container"></div>
  <div class="footer-bar">
    复变医疗科技 Copyright © 2022
  </div>
</div>
</template>

<script>
import marked from 'marked'
import axios from 'axios'
export default {
  name: 'user',
  components: {
  },
  data () {
    return {}
  },
  beforeCreate () {
    document.title = this.$route.name
  },
  mounted () {
    axios.get(process.env.BASE_URL + 'doc/复变用户协议.md').then(
      res => {
        const { data } = res
        this.$refs.content.innerHTML = marked(data)
      }
    )
  }
}
</script>

<style lang="less" scoped>
.container {
  max-width: 1108px;
  margin: 4rem auto 0;
  border: 1px solid #dfdfdf;
  padding: 1.25rem;
  /deep/ul {
    padding-left: 0;
    list-style: none;
  }
  /deep/ol {
    padding-left: 1.75em;
  }
  /deep/a {
    word-break: break-all;
  }
}
.footer-bar {
  text-align: center;
  margin: 1rem auto;
  color: rgba(0, 0, 0, .5);
}
</style>
