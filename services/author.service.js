const Author = require('../models/Author');

class AuthorService {
  async getAllAuthors(queryParams) {
    const { page = 1, limit = 10, name, nationality, genre, isActive } = queryParams;
    
    const filter = {};
    if (name) filter.name = { $regex: name, $options: 'i' };
    if (nationality) filter.nationality = { $regex: nationality, $options: 'i' };
    if (genre) filter.genres = genre;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const totalAuthors = await Author.countDocuments(filter);
    
    const authors = await Author.find(filter)
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });
    
    return {
      authors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalAuthors / parseInt(limit)),
        totalAuthors,
        limit: parseInt(limit)
      }
    };
  }

  async getAuthorById(authorId) {
    const author = await Author.findById(authorId);
    
    if (!author) {
      throw new Error('Author not found');
    }
    
    return author;
  }

  async createAuthor(authorData) {
    const { email, name } = authorData;
    
    if (email) {
      const existingAuthor = await Author.findOne({ email });
      if (existingAuthor) {
        throw new Error('Author with this email already exists');
      }
    }
    
    const author = await Author.create(authorData);
    return author;
  }

  async updateAuthor(authorId, updateData) {
    if (updateData.email) {
      const existingAuthor = await Author.findOne({ 
        email: updateData.email,
        _id: { $ne: authorId }
      });
      
      if (existingAuthor) {
        throw new Error('Author with this email already exists');
      }
    }
    
    const author = await Author.findByIdAndUpdate(
      authorId,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!author) {
      throw new Error('Author not found');
    }
    
    return author;
  }

  async deleteAuthor(authorId) {
    const author = await Author.findByIdAndDelete(authorId);
    
    if (!author) {
      throw new Error('Author not found');
    }
    
    return author;
  }

  async searchAuthors(searchTerm, queryParams) {
    const { page = 1, limit = 10 } = queryParams;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const authors = await Author.find(
      { $text: { $search: searchTerm } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(parseInt(limit))
      .skip(skip);
    
    const totalAuthors = await Author.countDocuments({ $text: { $search: searchTerm } });
    
    return {
      authors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalAuthors / parseInt(limit)),
        totalAuthors,
        limit: parseInt(limit)
      }
    };
  }

  async getAuthorsByGenre(genre, queryParams) {
    const { page = 1, limit = 10 } = queryParams;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const authors = await Author.find({ genres: genre })
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });
    
    const totalAuthors = await Author.countDocuments({ genres: genre });
    
    return {
      authors,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalAuthors / parseInt(limit)),
        totalAuthors,
        limit: parseInt(limit)
      }
    };
  }
}

module.exports = new AuthorService();
