document.getElementById('file').onchange = async function() {
  const fileName = this.files[0].name;
  this.disabled = true;
  document.getElementById('result').innerHTML = '<h1>In calculation...</h1>';
  document.getElementById('result').className = 'calculation';
  const sum = await getHah(this.files[0]);
  document.getElementById('result').className = '';
  this.value = '';
  this.disabled = false;
  document.getElementById('result').innerHTML = `<h1 class="filename">${fileName}</h1>
  <h2>MD5</h2>
  <p><code>${sum.md5}</code></p>
  <h2>SHA1</h2>
  <p><code>${sum.sha1}</code></p>`;
}

async function getHah(file) {
  const CHUNK_SIZE = 100 * 1024;
  const size = file.size;
  await NodeJS.createHash();
  let offset = 0;
  let completion = 0;
  while(offset < size) {
    const slice = file.slice(offset, Math.min(offset + CHUNK_SIZE, size));
    offset = Math.min(offset + CHUNK_SIZE, size);
    await updateHash(slice);
    if (completion !== Math.round(offset / size * 100)) {
      completion = Math.round(offset / size * 100);
      document.getElementById('result').innerHTML = `<h1>In calculation... ${completion}%</h1>`;
    }
  }
  const sum = await NodeJS.getHash();
  return sum;
}

async function updateHash(slice) {
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = async function() {
      const base64String = btoa(String.fromCharCode(...new Uint8Array(fr.result)));
      await NodeJS.updateHash(base64String);
      resolve();
      return;
    }
    fr.readAsArrayBuffer(slice);
  });
}

document.getElementById('dragndrop').ondragover = document.getElementById('dragndrop').ondragenter = function(e) {
  this.className = 'drag_in';
  e.preventDefault();
  e.stopPropagation();
};

document.getElementById('dragndrop').ondragleave = document.getElementById('dragndrop').ondragend = function(e) {
  this.className = '';
  e.preventDefault();
  e.stopPropagation();
};

document.getElementById('dragndrop').ondrop = function(e) {
  this.className = '';
  document.getElementById('file').files = e.dataTransfer.files;
  e.preventDefault();
  e.stopPropagation();
};