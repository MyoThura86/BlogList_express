const dummy = (blogs) => {
  if (blogs.length === 0) {
    return 1
  }
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.length === 0
    ? 0
    : blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const mostLiked = (previous, current) => {
    return previous.likes > current.likes ? previous : current
  }
  return blogs.length === 0
    ? null
    : blogs.reduce(mostLiked, 0)
}

const mostBlogs = (blogs) => {
  const blogCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1 
    return acc
  }, {})

  let maxBlogs = 0
  let authorWithMostBlogs = ''

  for (const author in blogCount) {
    if (blogCount[author] > maxBlogs) {
      maxBlogs = blogCount[author]
      authorWithMostBlogs = author
    }
  }
  return { author: authorWithMostBlogs, blogs: maxBlogs }
 
}

const mostLikes = (blogs) => {
  const likesCount = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})
  
  let maxLikes = 0
  let authorWithMostLikes = ''

  for (const author in likesCount) {
    if (likesCount[author] > maxLikes) {
      maxLikes = likesCount[author]
      authorWithMostLikes = author
    }
  }
  return { author: authorWithMostLikes, likes: maxLikes }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }