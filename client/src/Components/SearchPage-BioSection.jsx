export default function SearchPageBioSection({ tags }) {
    return (
        <div className="searchPage-bio-section">

            <div className="searchPage-bio-section-related-tags">
                <p className="searchPage-bio-section-related-tags-headings">
                    Recommended Tags
                </p>

                <div className="searchPage-bio-section-related-tags-div">
                    {tags.map(tag => (
                        <div key={tag} className="searchPage-bio-section-related-tag">
                            {tag}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}