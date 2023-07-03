import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';

import './charInfo.scss';

const CharInfo = (props) => {

    const [char, setChar] = useState(null);

    const {process, getCharacter, clearError, setProcess} = useMarvelService();

    useEffect(() => {
        updateChar();
    }, [props.charId])

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return
        }
        clearError();
        getCharacter(charId)
            .then(onCharLoaded)
            .then(() => setProcess('confirmed'))
    }

    // const skeleton = (char || loading || error) ? null : <Skeleton/>;
    // const errorMessage = error ? <ErrorMessage/> : null;
    // const spinner = loading ? <Spinner/> : null;
    // const content = (error || spinner || skeleton) ? null : <View char={char}/>;
    return (
        <>
            <div className="char__info">
                {setContent(process, View, char)}
            </div>
        </>
    )
}

const View = ({data}) => {
    const {name, description, thumbnail, homepage, wiki, comics} = data;
    const comicsSlice = comics.slice(0, 10);
    const comicsList = comicsSlice.map((item, i) => {
    let comicsFromCharInfo = item.resourceURI.replace(/\D/g, '').slice(1);
        return (
            <li className="char__comics-item" key={i}>
                <Link to={`/comics/${comicsFromCharInfo}`}>
                    {item.name}
                </Link>
            </li>
        )
    })
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail.indexOf('image_not_available') >= 0) {
        imgStyle = {'objectFit' : 'contain'}
    }
    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={imgStyle}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length === 0 ? 'Comics for this character not found' : comicsList}
            </ul>
        </>
    )
}

CharInfo.propTypes = {
    charId : PropTypes.number
}

export default CharInfo;