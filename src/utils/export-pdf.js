import Html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'

export function ExportPDF (fileName = '下载') {
  this.pdf = new JsPDF({
    unit: 'pt',
    format: 'a4'
  }) // 创建一个pdf
  this.reportLen = 0
  this.pageSize = 1
  this.fileName = fileName
  this.pagePadding = 20
  this.sizes = {
    w: 592.28,
    h: 841.89
  }
  this.reportFooterImg = null
}

// 打印报告
ExportPDF.prototype.downLoad = function (name) {
  const thisName = name || this.fileName
  this.pdf.save(`${thisName}.pdf`)
}

// 设置页码
ExportPDF.prototype.setPageSize = function () {
  let curPageSize = this.pageSize
  const x = this.sizes.w / 2
  const y = this.sizes.h - 10
  this.pdf.setTextColor(51, 51, 51)
  this.pdf.setFontSize(10)
  this.pdf.setFontStyle('lighter')
  while (curPageSize > 0) {
    this.pdf.setPage(curPageSize)
    this.pdf.text(`${curPageSize}/${this.pageSize}`, x, y)
    curPageSize--
  }
}

// 报告转图片
ExportPDF.prototype.reportToImgs = async function (reportEle) {
  const e = reportEle
  const ele = { ...e }
  const newReportImgs = {
    header: {},
    content: [],
    footer: {}
  }
  const paddingR = 15
  const canvasOpts = width => {
    return {
      allowTaint: true,
      width: width + paddingR,
      useCORS: true
    }
  }
  if (ele.header) {
    const Html2Cvs = new Html2Canvas(ele.header, canvasOpts(ele.header.clientWidth))
    const cvs = await Html2Cvs
    const img = cvs.toDataURL('image/jpeg', 1.0)
    newReportImgs.header.img = img
    newReportImgs.header.width = cvs.width
    newReportImgs.header.height = cvs.height
  }
  if (ele.footer) {
    if (this.reportFooterImg) {
      newReportImgs.footer = this.reportFooterImg
    } else {
      const Html2Cvs = new Html2Canvas(ele.footer, canvasOpts(ele.footer.clientWidth))
      const cvs = await Html2Cvs
      const img = cvs.toDataURL('image/jpeg', 1.0)
      const imgItem = {
        img,
        width: cvs.width,
        height: cvs.height
      }
      newReportImgs.footer = imgItem
      this.reportFooterImg = imgItem
    }
  }
  if (ele.content && ele.content.length > 0) {
    const img = []
    for (const item of ele.content) {
      const newItem = {}
      const Html2Cvs = new Html2Canvas(item, canvasOpts(item.clientWidth))
      const cvs = await Html2Cvs
      newItem.img = cvs.toDataURL('image/jpeg', 1.0)
      newItem.width = cvs.width
      newItem.height = cvs.height
      img.push(newItem)
    }
    newReportImgs.content = img
  }
  return newReportImgs
}

// 添加报告
ExportPDF.prototype.addReport = async function (reportObj) {
  const pageH = this.sizes.h
  if (this.reportLen) this.addPage()
  this.addReportItem(this.pdf, pageH, reportObj)
  this.reportLen++
}

// 添加页
ExportPDF.prototype.addPage = function () {
  this.pdf.addPage()
  this.pageSize++
}

// 图片裁剪
ExportPDF.prototype.cutPicture = function ({ cvs, cutHeight, surplusHeight, imgArr, scale }) {
  const curCsvHeight = surplusHeight || cvs.height
  const imgs = imgArr || []
  const postistion = cvs.height - curCsvHeight
  const curCtx = cvs.getContext('2d')
  const ch = curCsvHeight > cutHeight ? cutHeight : (curCsvHeight > 1 ? curCsvHeight : 1)
  const data = curCtx.getImageData(0, postistion, cvs.width, ch)
  const newImg = cvsToImg(data, cvs.width, ch)
  imgs.push({
    url: newImg,
    height: ch * scale
  })
  if (curCsvHeight > cutHeight) {
    return this.cutPicture({ cvs, cutHeight, surplusHeight: curCsvHeight - cutHeight, imgArr: imgs, scale })
  }
  return imgs
}

// canvas剪切图片
function cvsToImg (data, w, h) {
  const csv = document.createElement('canvas')
  csv.width = w
  csv.height = h
  const context = csv.getContext('2d')
  context.putImageData(data, 0, 0)
  return csv.toDataURL('image/png')
}

// pdf插入图片
ExportPDF.prototype.addJpg = function (pdf, el, postY) {
  const curPstX = this.pagePadding
  const curPstY = postY ?? 0
  const pageW = this.sizes.w - (curPstX * 2)
  const scale = pageW / el.width
  const itemH = el.height * scale
  pdf.addImage(el.img, 'JPEG', curPstX, curPstY, pageW, itemH)
}

// pdf插入报告
ExportPDF.prototype.addReportItem = function (pdf, pageH, report) {
  const { header, content, footer } = report
  const pageW = this.sizes.w - (this.pagePadding * 2)
  const scaleH = pageW / header.width
  const headH = header.height * scaleH
  const scaleF = pageW / footer.width
  const footerH = footer.height * scaleF
  const contentH = pageH - headH - footerH
  let calcHeight = contentH
  let pos = headH
  for (const contentImg of content) {
    const scaleC = pageW / contentImg.width
    const curItemH = contentImg.height * scaleC
    if (curItemH > calcHeight) {
      this.addPage()
      calcHeight = contentH
      pos = headH
    }
    if (contentH === calcHeight) {
      this.addJpg(pdf, header)
      this.addJpg(pdf, footer, pageH - footerH)
    }
    this.addJpg(pdf, contentImg, pos)
    calcHeight = calcHeight - curItemH
    pos = pos + curItemH
  }
}
