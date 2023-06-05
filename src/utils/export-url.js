export default function downloadLink (url) {
  const aLink = document.createElement('a')
  aLink.href = url
  aLink.style.display = 'none'
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink)
}
