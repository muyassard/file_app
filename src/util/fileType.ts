

export const fileType = {
    pdf: "https://play-lh.googleusercontent.com/9XKD5S7rwQ6FiPXSyp9SzLXfIue88ntf9sJ9K250IuHTL7pmn2-ZB0sngAX4A2Bw4w",
    zip: "https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/512x512/folder_zip.png",
    sql: "https://www.shareicon.net/data/2015/09/07/97430_document_512x512.png",
    html: "https://cdn4.iconfinder.com/data/icons/smashicons-file-types-flat/56/22_-_HTML_File_Flat-512.png",
    unknown: 'https://www.iconpacks.net/icons/2/free-file-icon-1453-thumb.png'
}


export const getFileType = (item: File) => {
    if (item.type.includes('png') || item.type.includes('jpg') || item.type.includes('jpeg')) return URL.createObjectURL(item)
    else if (item.type.includes('pdf')) return fileType.pdf;
    else if (item.type.includes('zip')) return fileType.zip;
    else if (item.type.includes('sql')) return fileType.sql;
    else if (item.type.includes('html')) return fileType.html;
    else { return fileType.unknown }
}