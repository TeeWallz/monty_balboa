
import React from 'react';

import HTMLComment from 'react-html-comment';

const comment = `


                              ,\`@@@@@@@\`\`                       \`\`  \`
                          ,\`@@@@@@@@\`                     \`  .
                          ,\`@@@@@@@@\`                     \` #@;\`\`\`
                          :\`@@@@@@@@                      @@@@@@@.
                          :\`@@@@@@@@                      @@@@@@@,
                          :\`@@@@@@@@                      @@@@@@@@
                          :\`@@@@@@@@                      @@@@@@@#
                          : @@@@@@@@                      @@@@@@@\`
                          :  @@@@@@.                      @@@@@@@.
                          :  ;@@#                        \`@@@@@@@\`
                          : \`:#@\`\`                        @@@@@@@
    \`    \` \`   \`\`\`  \`\`   \`: \`;#@                           :@@.\`
     @@@@@@@@@@@@@@@@@@@@@@@#+#@,.\`\`\`\`  \`\`                 ;@,\`
#@@.@.\`    \`      \`\`\`\`.\`\`..,:'+@@@@@@@@@@@@@@@+';:,,.\`\`\`\`\`\`@,\`
@@'@.\`\`\`\`\`  \`\`\`\`\`.\`\`\`.\`\`\`\`........\`\`.\`\`\`\`\`\`\`\`.,:;'#@@@@@@@@@@@@@+,\`\` \`.\`\`    \`\`\`     \`
@@,@\` \` \`\`\` \`\`\` \`\`\`\`\`\`\`\`\`\`\`\`\`\`\`....\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\` \`\`.\`.......::'+#@@@@@@@@@@#+;,.\`\`
@@\`@    \`@    \`@@@\`.@.;@\`@\` \`\`\` .\`..\`.\`\`\`\`\` \`\`\`\` \`\`\`\`\`\`.\`\`..\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`   \`\`.,;+@@@\`\`\`
@@.@    \`@  \` @.\`;@\`@\`@@\`@.\`\`\`\`\`+@@@\`\`@\`\`\`\`@@@#\` \`\`.\`\`\`\`.,.\`.\`\`\`\` \`\`\`    \`      \`\`  \` .@,#@#
@@\`@    \`@  \` @ \`\`@\`@.@@\`@\`.\`\`\`.@\`.;,.@\`\`\`\`@,.:. \`+@\`\`\`#@@@.\`\`.@.\`\`.:\`\`\` \`\`\`\`\`\` \`\` \`\` \`#.@@@
@@\`@     @\`  \`@\`\`\`@\`++@@,@\`\`\`\`\`.@\`\`\`\`\`@\`\`\`\`@,\`..\`\`@@,\` @'..@\`\`,@:\`\`,@\`.@  +@@,\`+@@#    \`#@@@
@@\`@     @\` \` @\`\`\`@\`,@@'@+\`\`\`\`\`\`@\`\`\`\`\`@\`\`\`\`@@@.\`\`\`@,@\`\`@;\`.@\`\`@,@\`\`:@# @\`\`@\` '\`#...     #@@@
@@ @   \` @ \`\`\`@:\`;@\`.@..@,\`\`\`\`\`\`@.\`\`\`\`@\`\`\`\`@,\`\`\`.#@.@\`\`@@@@.  @\`@\`\`:+@ @\`:#    #.\`     \`#@@@
@@ @    \`@@@@ \`@@@\`\` @\`\`@\`\`\`\`\`\`.@;\`@.\`@\`\`\`.@\`\`\`.\`@@@@\`\`@,\`@\`\`,@@@,\`:#'@@\`:;\`   +@@.    \`#@@@
@@ @    \`   \`\`\`\`\`\`\`  . \`:\`\`\`\`\`\`\`.@@# \`@@@@ @@##.\`@\`\`:@.@,\`@:\`@,\`,@\`'#\`@@\`.@\`\` \`#\`    \`\`.'@@@
@@\`@    \`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`.,;,+;\`\`\`@\`@.\`.@\`@\`\`\`@ +'\`.@\`\`@. @ #\` \`\`\`\`\`;,@@@
@@\`@   \`\` \`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\` \` \`\`\` \`\`\`\`\`:\`::.\`#  .@@.\`#@@@.\`\`\`+.@@@
@@\`@    \`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\` .\`\`\`\`\`\`\`\`\`\`\`\` \`  .\`\`\`\`\`.   \`\`\`\`\`\`\`\`\`\`\`\`@\`@@@
@@\`@    \` \`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`.,,\`\`\` \`\`\`\`\`   \`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`     \`\`\`\`\`\`\`@\`@@@
@@\`@    \`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`.@@@@  \`\`\` @@@\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`     \`\`\`\`\`\`\`@,@@@
@@\`@     \`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`.\`\`@+\` \` @:.+@\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\` \`\`\`\`\`\`\`\`   \`\`\`\`\`\`\`\`@:@@@
@@\`@\`\`\`\`\`\`\`\` \`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`@@\`\`\`\`\`@.  @ \`\`... \`  \`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`.\`@'@@@
@@\`@\`\`\`\`\`\`\` \`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`,@'\`\` ,@ \`\`@\`\`\`@@@@@@\` \`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`  \`\`\`\`\`\`...@@@@@
@@ @\`\`\`\`\`\`\`\`\`\`\`\`\`\`  \`\`\`\`\`\`\`\`\`\`\`\`\`\`.\`\`\`\`@\`..\`@ \`.@ \`\`@\`'#\`@\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`....\`@@@@@
@@.#\`\`\`\`\`\`\`\`\` \`\`\`\`\`\`\`\`\`\`\`\`\`  \`\`\`\`\`;@,,@#\`\`..@..,@\` \`@ '+\`@\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`  \`\`.......\`\`.@@@@@
@@\`@\`\`\`\`\`\`\`\`\`  \`\`\`\`\`\`\`\`\`\`\` \`\`\`\`\` \`\`.@@+ \`@\`\`,@@@: \`\`@\`+' @ \`\`\`\`\`\`\`\` \`\`\`\`\`\`\`.,,......\`.':@@@@
@@@@; .\`   \`\`\`\` \`\`  \`\`\`\` \`\`  \`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`\`.\`..\`+\`\`\`\`\`\`\`\`\`\`\`\`\`\`\` :,:,..,....\`@.@@@@
@@@.@@...,,,...\`\`\`\`\`\`\`\`\`\`\`\`\`SERIOUSLY THOUGH HOW FUCKING HARD IS IT \`\`\`\`  \`,:,,,,.....@:@@@@
'@@@,\`'+++##@@@#@@@@@@@@@@@@@@@#+':,..\`\`\`    \` \` \`\`\`\`\`  \`\`    \`\`  \`\`\`\` \`\`\` \`',,.......@@@@@@
.'+++##:.....;+++''.\`.\`\`\`.\`\`\`\`..,:'+##@@@@@@@@@@@@@@@@##++;,.\` \`\`\`   \` \`\`\`\`\`...,.....+;@@@@@




`

class FunnyHtmlComment extends React.Component {
    render() {
        return <HTMLComment text={comment} />;
    }
}

export default FunnyHtmlComment