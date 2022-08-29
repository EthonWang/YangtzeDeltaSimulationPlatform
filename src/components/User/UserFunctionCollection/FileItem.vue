<template>
  <div class="file" @click="choose()">
    <span
      style="position: absolute; right: 10%; top: 10%; color: rgb(61, 204, 56)"
      v-if="file.publicBoolean"
      ><el-icon><Unlock /></el-icon
    ></span>
    <span
      style="position: absolute; right: 10%; top: 10%; color: rgb(228, 170, 10)"
      v-if="!file.publicBoolean"
      ><el-icon><Lock /></el-icon
    ></span>
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACoCAMAAABDlVWGAAAAwFBMVEUAAAD/2Ur/20z/203/40X//3j/yiX/zCv/3lD/2kv/yib/yiX/yib/2kr/2kr/yiX/2kv/2kv/yyb/2UT/1Tv/20H/yib/2kr/yib/2kr/yiX/20v/2kr/3Uz/5Vj/2kr/ySX/ySX/yiX/2Ur/20v/2Uz/ySj/zSf/20z/ySb/2kv/2Ur/2Ur/2Uv/yiX/0DX/yib/2Uz/yiX/yyf/20v/ySf/2kr/ySf/20z/2Uz/yyb/4k7/////2Ur/ySX/zS9+lhVZAAAAPXRSTlMAr1RGBQKWFw2o9PHt69/YiYBpKyIT+/bLwIFfWDMJ8OPHv7ePbEdBP+DU0tG8uKmnopCEd3duVU02NhoBsiz/2wAAAaxJREFUeNrt1GdSIzEQQOE2nuhsnCNhgWVzDoQW978V8J/CowkSqnrfCV5J3S0AAAAAAAAAXhVdJefDjjlg3vuw/L7+l4ovadI1NoY/b8WDaN0x1oZ/MnEsPTOldH/NxKXJqSmrdxyLM+mpqWA5FUeiM1NJ7724sTYVzY/FhbRjKksiaV5iavC1+dKoa+qQSNOuTD1emNM3+PNP5k3v/rmpSW8qjRqauixjadLzcQpiTE19uqk06KFG39oHXU8yKUedO8m3WRChTxbjLIxQ1f42kFDVURxIqLbiQEJ1FEqobkIJ7WeBhOoolNDFLJBQ3YQS2goldBEHEqp3oYTuQgn9H0roEaGEEkoooYQSSiihhBZHKKGEEkoooYQSSqgNQgkllFBCCSWUUEJtEEoooYQSSiihhBJqg9DD+urVtRT1Wb2aSlHv1Ku9FDVWnz5JYRP1aSzFDdSjnRR3qf6sxELk8UlvxMaR+pKLnQv142MmdmI/t7Q/FVv7XN0bTMTe/VhdW82klN0XdWmwiaWsdn6ijqwu91JF1P47+tFqVn7xezsTAAAAAAAAAK97BM+evOtMrXyJAAAAAElFTkSuQmCC"
      v-if="file.type == 'folder'"
      @dblclick="comeIn()"
      style="width: 80%"
    />

    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKgAAACoCAMAAABDlVWGAAAA81BMVEUAAADJlliA0kCQqMj/c2zEwEJZzPl+zztVyPhVx/hVyPiA0DyA0T2D10Bh0/9/0DtVyfeA0DxXyflYyfpXzP/3rklVyPhVyPdVx/d+zzt/0Dt/zzt/0DxWyPhXyvl/0Tyq/1X///+XqcFWyPiA0Tx+0DvAxEOA0z2Gtde6pVqA1UCG2z1+zztVx/f9bWv9r0L///9dxu/rsVbvskGEzjz9y4b9v2f++/f+79n+8vL+3Nz9ypD9wm/9ioj9oaD9cGn9p0b+/Pv+0tH9c3H9h4b+6ur+6Oj+9Ob9enj+9vb+xsb+trX9r679mZf9xoj9fnz9uGv+eDTsAAAALHRSTlMAwCjLKEkn/PbUrJQ6GQ7zg3VRMhf58ezk3NXBr2xbUgMBzZiEZ0UuJiUkFb0s5qIAAAHjSURBVHja7dj3UttAEIDxC0mQ3LANoff0dsbpgUSAC72+/9NgHkA3i1bew8z3/avRzm92NCPpHBERERERERERUcRmNqqVRR/q+05+33yghUp1/VVZzFbqR6mg4d6UQp1b8l4PDbcwq3fOpl4NFbSu3mfqTaBeudOZJW8ETadV0Ja3gvqqaqGpHdTPKaAb3hDaUkCrltCKAlqxhKbbxaGLllCveD95U+g0UKBAgQIFChQoUKBAgQIFCrRE6HNp8wHoa+mQj8WhHWmHAeiBdMgLoJMFHQyzLLv9nV82ahAdetrvdSXtDeNCB0ddYWc3UaGXXXHnUaF9OfQ4KnRPDt0F+iShvT+59R4V9N9Obv+BAgUKFChQoJMPPfmb28mjgk7MZx7QCD93R1GhF3JoPyr0dFfq7A2jQjvZsfAJvYp+SJbtj7r+ld/99WzQiQ6dmGNHoA/pmbT5AFQ85FNx6FdpPwLQn9IhU0CBAgUKFChQoECBAgUKFCjQEqFNU2ijOHTFEppsFYeuWUKXXfHeWUJrCmgjMYTWnaKaHXTVaWo0raBJ3anatIK2nbK2DbTm1G02xw9N2q6EPq+NG7pad+X04e1KMi5oslwTMOVtf5kK9f5lfsEbG1uOiIiIiIiIiIiIZN0Br4ZJiTiBqxAAAAAASUVORK5CYII="
      v-else-if="
        file.name.split('.')[file.name.split('.').length-1] == 'zip' || file.name.split('.')[file.name.split('.').length-1] == 'rar'
      "
      style="width: 80%"
    />
    <img
      src="data:image/png;base64,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"
      v-else-if="
        file.name.split('.')[file.name.split('.').length-1] == 'docx' || file.name.split('.')[file.name.split('.').length-1] == 'doc'
      "
      style="width: 80%"
    />
    <img
      src="data:image/png;base64,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"
      v-else-if="
        file.name.split('.')[file.name.split('.').length-1] == 'ppt' || file.name.split('.')[file.name.split('.').length-1] == 'pptx'
      "
      style="width: 80%"
    />
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABXUExURUxpcWm8PoPMXYjOY3vHVYfNYnrGU3fDT2i7PInOZmq8QG6/RIPLXnHBSIbNYYDJWnXDTXnFUXzHVYnOZfH/6uj93fr/91WqKdb0xl+yNcTqsK7elZrTfKStZRwAAAAKdFJOUwDUm68l2ndAoJ8lo9fZAAAFe0lEQVR42u2aiXbjKBBFO+nY7gYkFtnWxv9/50BRBUiW04nA02fm6DlaC+pdShJRTvzjx6FDhw4dOnTo0KFD/wFdzr+/qPPlBfbn7js6nSvbf5y6b+r0UdW/+75qEoTxt5+4ta8l+JmZtMmuTTuwtOlMXYILZCczEDqCZdsuqtBCACK1CH625Ivuy51FbBmqRNDlSWl0K7sut+7iXhWCj/ZL2ixEFYJLW6JTBQCR0olFcrFxWqz3TjUqIEK6sBFp1y1oI4TIVrGhX59qAIDZAiOkF2mwYlkbgVwVagAA3k7QENMWxy5QVBWBdHj2VHoP5B4Lre0fg0Hv5QCFev/bAEUETwDkH01lvn0vA5A+i0xJJR3IlWUI+I1cIZwrVEAmcykXVZCrZQkloct+ABpuGJQUcZgxQGdTGxlXkfu8H2AhgauwFXkkMqSWWYNTDQBBBK21rXwia+3m+UoVAM23222YN226wcUmsRH5qAcw3+73+/VmN/2vPjZthC7VAAyY3O+37om/C9lXAgh0uQ7dk8h9sOZ1AKaBS5AIDC5STuh/m2QGYIoBjM9h8CMN76ZIIFLAmARmmc57AENJBXySkMUn46OloV6nNFLn785e79frMI8eAIdvQv/9AH5sBla4o8beDrHYhvCcP8g9oGzkoXHqJM1+gKW9NJqN4xwJZjSyyV/1TGHbCG/KAEw+HKNYz4jgigRuAiL/ph+ViRWIHasAoBwBTwTWndF+AvQaJtOPjV4zm7oAumG9AoIrPIxQAPTv+pHrjT5VARzB2OvpBtOuI2i1nIbgb5/5VwKg3JqPvZsOrtfw3Ak+e4Lgrx55iwB0SBE+cUc5AusJPMBt4mqepmm2fXgAorFO0GUA5G5wo7ViRHD1N2LPOmuN94+UyAudnPYDoAwudAAEA1wFdxHaHuT8N1QOsDYHuYfRTUj4+E/S2Y+sCVGDDfN+xRV4VAMTEhF0jHH1vPErAJR7GFUkGDr1mf8rALR/FHIC/W8DAIGbg+jXkHgVgIIfMsUDt7KTn3rdhEQ18A8HNVWhZThWRQCQQVFmFVP7NxA/BeB04O9EuOWVInsVj0oAVBAkxV1Y2fAGdtOeAGswK03x0IXaa7UbAIYekxKFVujv3s57qAF8HEFsphcdSgBUPnDa64b4ajxmExIQ6FUHXQkgl0hvhX5ODhOSL8HNbneoDBD/OHEz4MhxOggXwU9ILwfQ6b53bwBN4wh0IpAvB2gW/qxRDYMJyb8UPSUoAnAWuIbtnPn37leQAoJuojfTyaz7NMUAYQkrC7X2Q53dA8CDA7yfRIKcF7vtB4BkDab0PxO9gs8M/EOAwXSAka4JXfwPlmI3QAOmTdhA2on8G+9PcjfiSAQOAHupGC8BQGPM5J958mdwPnx4mJDg7Vwme4Xr/QBpECEj6+ZhGCb3JyD4J8GENPmYzSpTpwJNHErD2djZebbS+a9sHAF3odmyCKAqAtC1djajfxt78IdQrzTzz+YLKpDdbT28Aj+aAEF4Pa4KwHFBFz664Qd/OMsXBDGG53k5ACeE8PE2TnQq/MQPhLIeMb4bwPfnmIpj6rDTEBWFG86pDWzwMKz3AxABeYXLEFLzhRUeEPGSYv8l4FtqHu0p0Gw3L6jAyu9TLQqz2C8DqKD/KwD70qkaACwkZuTBeB6IKxbDy08BQErLEIC8Gdky3KQisITMQ7wAAERDYXTI6DBGEIJFpNASQdlegA8aKI0zOhBIvs2O+Ap697c5+Dpz7hGrg4ac5Xh5T777P5dv0ZFvgGyf2ED4tf9fp38w+qIKvuP3xipofwHcbVjB/63oC0UVCAq/0PTx9jfHDzqXINT5gufl/GuXXvIV10OHDh06dOjQoUOHqusfP5xc4k2wRgQAAAAASUVORK5CYII="
      v-else-if="file.name.split('.')[file.name.split('.').length-1] == 'xlsx'"
      style="width: 80%"
    />
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABaUExURUxpcf+iWP+YRf+VQP+xcP+kWP+ubf+fUvyMPv+ROP+TO/+jWf+pY/+mX/+rZ/+gVP///v+cTf+ta/+vbv+wcf/r2//y5//58/h+Nf/dwf+7hf/Npf/Elv+0efOdw1AAAAAKdFJOUwB3//+fJdpA/KGWpReyAAAEe0lEQVR42u2aDXOrKhCGT6SNVFD8iFqj+f9/88IuIJg0Y4SczpnLiy7f7MOGTuLUP3+SkpKSkpKSkpKS/gHlp4+dOuVvcH+6vKLzKbL7z/PlRZ0/o/q/vK6YBHL/XacWNabTRdTa9S6Cj+6ZpPPHikaQdwcVi2ATgPavEzhuW1NqDUfrIjltaKIQfCpnrRQYt2gyyDu8Oreva2MQ5G2Izr8NEIEgECCcIG8rtY4xVVU5NWVkqrBHdUIRqqpB2VCCvMJlcfk7tffV1maAE0qQP/HXuk2uX18fEQGO6eO3AYII8opX6gLx7cr8gTdeuVOwJYAg5xWXFyRlONemAlNhI3SaXjsIW0GnAAArvfRTVY5151UxAO48VT8z3HWdYgNw3l6vN75b59gA7TzWdT3tRwgEKGWCDHPO+xo0XHS36SjXwdzrOvrNnJelXk3l8sZsrrX6cnUEQ5X3Ek1pW6Ty4wBmUXSB6g1AfYM6otmce4OhIwDggfhgAa7lE5kwhEXgXmyNwHhl5S7FBWim0Z6B3wFoeyQYFip0YzVP0+U9AEztkmHssdrQ6zSM4zAtNNMAFzgWix7FrDGzAgCMVyjgyoLScpnn5UZpo51MeCR4aWiZmYT1wwBmAcZgVaQRDf3+ppR+ywAwUKvPxMxgJEwoGbP07DiAUckciUwSfBv/smsyfxWlP9KWAwBKu5CzuGgySrNG798GQIXADPRRwiOw3ZVQMk2TBRhL9lAxAeznYEtVXfsh+DsAqyYH4IcQRAdoOcRAbAPghUBEAxBmMYF3K78Mhta4mTyAEbiEM0GZ4wDypMFxE7AoVsoBgy3gLPLa1yyEPqHaqPwwgF5LeNK/RyasTRuAkT2YEgjgy37mN692F4K3AdgtD+xBAEwI3gfQeXvldb0nBDEB4OfQWI/w7acCMMK1tmJkogM0Or+OSsqX1MShjBXbOi6+9yYMoNEJDetHV37NSIWgcVI4AGYKYhn3aGnMRD33MEDTKMdaslSqn2KQdLYmt63XEbMKAFAb10le8zBIB+rSGXr0GtS1GGQ9MzQCQgegGnaq144jRMCJf9NMewFMCCICKF3V3vTV3xf7Net78QYAMfVSg2vgwnyTXd8AsPQvaMqiA7D+JYBYEVAbwc100yv+Z4Izs+AImHUyIZ8/d2su5XMDeleTwwBkUotRdt2tm5DPTVIwNwuJACyCNzyO7RYlOAshDgNkTWZCkJFXCOST2zo3CwBwReh+EWdeEwOgMRDGEiwSYtogWzvcSbEicEzNbwNk/xcA8lOdBAI4580mr7wpOF3r8OMAcj6cc21AfhV8as+6MSMmx5uEALgyWyIkc+obZcSD0C1hAA8dPXD6gMIoTgQClACOAnySQiYC90YFdhW64nehKcw4Qg6/zUELYhKsVhSrE1XRbgoLhLc2cKkyPfyfy6/iiYhvnujr+L9Ot65s/bnPzYSAd/y+igg6HgB5DGm4fxr0QlE4AQ18oSmUgIa/UHUKQKBxXvDMT1+H9JZXXJOSkpKSkpKSkpKi6z9pHi9W/1wpkgAAAABJRU5ErkJggg=="
      v-else-if="
        file.name.split('.')[file.name.split('.').length-1] == 'jpg' ||
        file.name.split('.')[file.name.split('.').length-1] == 'png' ||
        file.name.split('.')[file.name.split('.').length-1] == 'jpeg' ||
        file.name.split('.')[file.name.split('.').length-1] == 'gif' ||
        file.name.split('.')[file.name.split('.').length-1] == 'pdf' ||
        file.name.split('.')[file.name.split('.').length-1] == 'bmp'
      "
      style="width: 80%"
    />
    <img
      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAABFUExURUxpcTOK+DmO+Vyi/lKa/WOm/k+a/EmX+zGJ+Gep/0KT+mKl/0+b/D2Q+kqY+1af/UaV+2ao//v9/+rz/6HJ/t3s/7/b/1hPTuUAAAAKdFJOUwD///8l2ndAoZ9LaL0QAAAEsElEQVR42u2aiZajKhCGB8zSYRNH4/s/6iBVQBE1uRHSfe4MfwybRdVHkTPqtL9+NTU1NTU1NTU1Nf0PdL3c/qMu1w+Evwzv6HypHP50Ht7U+VQ1/vC+ahK8v/7KBDfvUEbXchVMbo1WI7guviX6d7WUGA/qZcT3kCOcHGQtgpuPRTXQ6uEcPVWJABbp15mKAWJElGF1aimrEJzkrp6kAFWD4CpLdP5pgAoEANDBd1V1cLKDdkfaoXWuANAl79iWj2EoGoVzJ881MhCCA0GsZex7yfSBCqYVElzBNYSRXSo7ROq6FBPCBphgeSsFyMJK4j/D6iJpyFI0vBVngAbIlrlTdAShNAc5wFHdfhqgu/w0QFcO0PtvD0UP/TQEBuFIVlh2/aUAoI+f6J4Orqh6ggUNV55LAHp/pEW9VgdTYsNNOgyADolTV6ZbMLlxP9hFiPBxOhUAYAJCeDmPLzTLdUquxwHynCt5H3+/0j3mLc6+Fm0BBZhex/89Tko9zKsFoMx0fw1wn8zHAOwwv0zBOA+2JgD48qVS1k7zPWlEmnEkg/NkA4CqAKCWQ4EzB8DNMCXNuCEuKJHh1qg4y9dFW5D8KGU0Y1xEGdiQcTJpzFloq1ScU5aBuBAFpVn8E00IkA1yYVSgRvDjAIt8eF8q4wj4cwCuhVWoPjQKAPrkpfcE1mXZa0GJAC6sFsshhPsBgHGPs4ozoDIM42UX6QjAtbUw7AqlVtOKATIZKNx28Agglrjua0i2+jSlLkAESQDamqemfxsAZPphC3a2qgKAD2fCxqeNXgGY7AMEBqrjADGkMdGzwfb6R4jx0B5m+qMAIErFtgqdHMCQ8waJg/lhAJP7CkvDfwvyLTAhW5mgWwZgVl5xiALYVVCqYoBN2T0A890A94l9FMCa6N2GC8FeBmwqU1EGAOEtXGiW0Db4tprDPeqSAWETq79SZbaHAexKJtQuAe5qePd3hBPTPpolpbEBxNXHMwAOvBOsAMLQy7HLgLsL2RTyVswAUcjAA4DJU/UNAH4LxFPT4wDgV7yTAUErUQjgftzOx3KjB18LA1AhwAgAwVJYMLRhwnKmACAIPdGeBxghAxwjRws6S4hygNwvigPAiADU2OaTKmRgQ5oC6KemfymA24Jhdk/I93n4VgAdCpcBMc1OEycA/gFJCx16uhAAnWnywfD+KdG6p/VBsASgHyjgKAPwh3eLLSw0X55T4VlV62iKD45gLqB9GEA/kQAAfCQmwyJiQN+pBADXHdYSR7w4ASDD0EiF/kQGYA88AeePK37UR7ZAA8GiV2alAFxzrFND88hATgTjaIDtwwAcVqlxlRCMhxjcd9KgP4GDYQr0jgNk0qnWG8N825oXA+jtKPmw3iGFqlIGjutfAWC7VQEA8x4YNBg09joh6DLO0swCgFNYBEuuQwQaGE/GsWSH7cNvc6SrDVz2eN5kjLTx2hgqLAHi8F8uv+Kq0OeKhKc42F6NMPZ1/E+nuxkI/sn/Use00Lz5suAdvy9GAtHMb0SmdJnh8QQsP0OWL+dNeZSiF4pOrFiFLzSdeFl4Xv5C1aUEoc4LntfL1yF95BXXpqampqampqampur6A54P7ERGXkPNAAAAAElFTkSuQmCC"
      v-else-if="file.name.split('.')[file.name.split('.').length-1] == 'txt'"
      style="width: 80%"
    />

    <img
      src="data:image/png;base64,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"
      v-else
      style="width: 80%"
    />
    <!-- <br /> -->
    <span v-if="file.type != 'folder' && file.type != 'zip'" class="type">{{
      file.name.split(".")[file.name.split('.').length-1]
    }}</span>
    <span
      style="font-size: 16px; width: 90%; overflow-x: hidden"
      v-if="!file.rename"
      >{{ getFileName(file).slice(0, 20) }}
    </span>
    <span style="font-size: 16px; width: 100%; display: flex" v-if="file.rename"
      ><el-input
        v-model="file.name"
        maxlength="10"
        placeholder="请命名"
        type="text"
        @keyup.enter="createFolder()"
        style="text-align: center"
      /><el-button
        style="
          width: 10px;
          border: 0;
          position: absolute;
          background: transparent;
          right: 0;
        "
        @click="createFolder()"
        ><el-icon><FolderChecked /></el-icon
      ></el-button>
      
    </span>
    <div v-if="file.rename" style="position: absolute;top: 200px;">
      <el-tree-select
      
        :popper-append-to-body="false"
        v-model="file.problemTags"
        :data="options"
        multiple
        show-checkbox
        placeholder="选择科学专题"
      />
    </div>
    
  </div>
</template>

<script setup>
//采用vue2写法的话把setup去掉，
import { reactive, computed, ref, defineProps, defineEmits, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { sciencePro } from "@/assets/data/home/sciencePro";
const router = useRouter(); //路由直接用router.push(...)
const store = useStore(); //vuex直接用store.commit
const props = defineProps({
  prop_file: Object,
  prop_index: Number,
});

const emit = defineEmits([
  "createFolder_f",
  "choose_f",
  "rightClick_f",
  "comeIn_f",
]);

//使用ref包裹，把函数当作一个响应式动态变量
const getFileName=ref((file)=>{
  let name=""
  let nameSplit=file.name.split(".")
  if(nameSplit.length==1){
    name=file.name
  }else{
    for(let i in nameSplit){
    if(i==nameSplit.length-1){break}
    name+=nameSplit[i]
    if(i<nameSplit.length-2){
      name+='.'
    }
  }
  }
  
  return name
})
const options = Array.from({ length: sciencePro.length }).map((_, idx) => {
  const label = idx;
  return {
    value: sciencePro[label].name.replace("\n", "").replace("\r", ""),
    label: sciencePro[label].name.replace("\n", "").replace("\r", ""),
    children: Array.from({ length: sciencePro[label].children.length }).map(
      (_, idx1) => ({
        value: sciencePro[label].children[idx1].name
          .replace("\n", "")
          .replace("\r", ""),
        label: sciencePro[label].children[idx1].name
          .replace("\n", "")
          .replace("\r", ""),
      })
    ),
  };
});
const createFolder = () => {
  emit("createFolder_f", index);
};
const choose = () => {
  emit("choose_f", file, index);
};
const rightClick = (e) => {
  emit("rightClick_f", e, file, index);
};
const comeIn = () => {
  emit("comeIn_f", file);
};

const file = ref(props.prop_file);
const index = ref(props.prop_index);

watch(
  () => props.prop_file,
  (new_val, old_val) => {
    file.value = new_val;
  }
);
watch(
  () => props.prop_index,
  (new_val, old_val) => {
    index.value = new_val;
  }
);
</script>

<style lang="less" scoped>
// 兼容css
.file {
  margin: 5px;
  position: relative;
  border-radius: 3%;
  // background: blue;
  float: left;
  height: 220px;
  width: $height * 3/4;
  z-index: 3;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  transition: all 0.5s;
  cursor: pointer;
  // border:0px dashed hsl(210,100%,50%);
  // justify-content: center;
  &:hover {
    background-color: rgba(35, 120, 247, 0.15);
    box-shadow: 0 1px 6px rgba(35, 120, 247, 0.15);
    // border: 1px dashed hsl(210,100%,50%);
  }
  img {
    margin-top: 20%;
  }
  span {
    text-align: center;
  }
  .type {
    position: absolute;
    top: 52.5%;
    // margin-left: 4%;
    opacity: 0.8;
    max-width: 90px;
    line-height: 100%;
    color: rgb(255, 255, 255);
    font-weight: 800;
    font-size: auto;
  }
}
</style>

