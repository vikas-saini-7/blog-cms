const { createBlog, updateBlog } = require("@/services/admin/blog.service");

exports.create = async (req, res) => {
  try {
    const { title, coverUrl, status, description, content, categories, tags } =
      req.body;
    const userId = req.user.id;

    const blog = await createBlog({
      title,
      coverUrl,
      description,
      status,
      content,
      categories,
      tags,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Blog Created Successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const blogId = req.params.id;
    const { title, coverUrl, status, description, content, categories, tags } =
      req.body;

    // Call the update service (to be implemented)
    const updatedBlog = await updateBlog(blogId, {
      title,
      coverUrl,
      description,
      status,
      content,
      categories,
      tags,
    });

    res.status(200).json({
      success: true,
      message: "Blog Updated Successfully",
      data: updatedBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.preview = async (req, res) => {
  try {
    const blogId = req.params.id;

    const draftBlog = await getPreviewBlog(blogId);

    res.status(200).json({
      success: true,
      message: "Blog Preview Fetched Successfully",
      data: draftBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.list = async (req, res) => {
  try {
    const { page, limit, status, search } = req.body;
    const blogs = await listBlogs({ page, limit, status, search });

    res.status(200).json({
      success: true,
      message: "Blogs Fetched Successfully",
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id;

    await deleteBlog({ blogId, userId });

    res.status(200).json({
      success: true,
      message: "Blog Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};
